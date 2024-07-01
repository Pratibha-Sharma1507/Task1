const User = require('../models/user');
const Policy = require('../models/policy');

const searchPolicy = async (req, res) => {
  const username = req.query.username;
  try {
    const user = await User.findOne({ firstname: username }).populate('policies');
    if (user) {
      res.status(200).json(user.policies);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const aggregatePolicies = async (req, res) => {
  try {
    const result = await Policy.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user_info',
        },
      },
      {
        $group: {
          _id: '$userId',
          total_policies: { $sum: 1 },
          policies: { $push: '$$ROOT' },
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  searchPolicy,
  aggregatePolicies,
};

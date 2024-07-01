const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  firstname: String,
  dob: Date,
  address: String,
  phoneNumber: String,
  state: String,
  zipCode: String,
  email: String,
  gender: String,
  userType: String,
  accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
  policies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Policy' }]
});
module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const policySchema = new mongoose.Schema({
  policyNumber: String,
  policyStartDate: Date,
  policyEndDate: Date,
  policyCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  companyCollectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Policy', policySchema);

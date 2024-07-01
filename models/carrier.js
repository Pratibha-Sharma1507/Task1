const mongoose = require('mongoose');
const carrierSchema = new mongoose.Schema({
  companyName: String,
  policies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Policy' }]
});
module.exports = mongoose.model('Carrier', carrierSchema);

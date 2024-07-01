const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
  categoryName: String,
  policies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Policy' }]
});
module.exports = mongoose.model('Category', categorySchema);

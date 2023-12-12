const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  notes: String,
  isRead: { type: Boolean, default: false },
  createdAt: Number,
});

module.exports = mongoose.model("contact", contactSchema);

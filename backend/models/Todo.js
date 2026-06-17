const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: String,

  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low"
  },

  dueDate: Date,

  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending"
  },

  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Todo", todoSchema);
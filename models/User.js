const mongoose = require("mongoose");
//Create schema
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, enum: ["employee", "manager"], default: "employee" },

    tasks: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Task' }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
//Create and export model
const User = mongoose.model("User", userSchema);
module.exports = User;
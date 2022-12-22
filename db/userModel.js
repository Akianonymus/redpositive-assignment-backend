const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide an Username!"],
    unique: [true, "Username Exist"],
  },

  phone: {
    type: String,
    required: [true, "Please provide a phone number!"],
    unique: false,
  },

  email: {
    type: String,
    required: [true, "Please provide a email!"],
    unique: false,
  },

  hobbies: {
    type: String,
    required: [true, "Please provide hobbies!"],
    unique: false,
  },
});

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);

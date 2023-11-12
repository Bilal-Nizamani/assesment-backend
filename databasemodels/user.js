import mongoose from "mongoose";

// Define the main user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: [true, "username alreasdy exist"],
  },
  email: {
    type: String,
    required: [true, " email is required"],
    unique: [true, "email already exist"],
  },
  hash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  cards: {
    type: Object,
    default: {}, // Default to an empty array
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;

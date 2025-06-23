import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    Name: { type: String },
    Class: { type: String }
})
const User = mongoose.model("user", UserSchema);

export default User;
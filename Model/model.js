import mongoose, { mongo } from "mongoose";
const UserSchema = new mongoose.Schema({
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    Name: { type: String },
    Class: { type: String }
})
export const User = mongoose.model("user", UserSchema);
const TestSchema = new mongoose.Schema({
    Title: { type: String },
    Duration: { type: Number },
    Subject: { type: String },
    Questions: [
        {
            Statement: {
                type: String,
            },
            Option: {
                type: [String],
                validate: [arr => arr.length === 4, 'There must be exactly 4 options'],
            },
            Answer: {
                type: Number,
                min: 1,
                max: 4,
            }
        }
    ],
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    Attempts: {
        type: Number,
        default: 0
    },
    Avg: {
        type: Number,
        default: 0
    },

});
export const Test = mongoose.model("Test", TestSchema);
const UserTests = mongoose.Schema({
    UserId: {
        type: String,
    },
    Attempted: {
        type: Array,
        default: []
    },
    UnAttempted: {
        type: Array,
        default: []
    },
    Created: {
        type: Array,
        default: []
    }
})
export const UserTest = mongoose.model("UserTests", UserTests);

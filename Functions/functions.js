import User from "../Model/model.js"
import nodemailer from "nodemailer"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config();
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});
export const DirectLogin = async (req, res) => {
    const { email, pass } = req.body;
    console.log(typeof (email));
    console.log(email);

    const user = await User.findOne({ Email: email });
    if (!user) {
        res.status(400).json("User not found");
        console.log("User not found");
        return;
    }
    if (user.Password === pass) {
        res.cookie("user", JSON.stringify(user), {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({ message: "Login Successfull" });
    }
    return res.status(404).json({ message: "Incorrect Pass" });
}
export const FindEmail = async (req, res) => {
    const { Email } = req.body;
    const isthere = await User.findOne({ Email });
    if (!isthere) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User found" });

}
export const Signup = async (req, res) => {
    const { Email } = req.body;
    const isthere = await User.findOne({ Email });
    if (isthere) return res.status(404).json({ message: "Email already Registered" })
    return res.status(200).json({ message: "Success" });

}
export const Sendotp = async (req, res) => {
    const { Email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const mailOptions = {
        from: process.env.EMAIL,
        to: Email,
        subject: "OTP Verification",
        text: "Do not Share this OTP with anyone",
        html: `<p>${otp}<p/>`
    }
    try {
        await transporter.sendMail(mailOptions);
        console.log(otp);
        return res.status(200).json({ message: "Email Sent Successfully", otp: otp });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Mail Not Sent" });
    }
}
export const Createuser = async (req, res) => {
    const { Name, Class, Password, Email } = req.body;
    const newUser = await User.create({
        Name, Email, Password, Class
    })
    if (!newUser) {
        console.log("Failed to create user");
        return res.status(404).json({ message: "Failed to create User" });
    }
    console.log(newUser);
}
export const DeleteUser = async (req, res) => {
    const { Email } = req.body;
    try {
        await User.deleteOne({ Email });

    } catch (error) {
        console.log("Error in deleting");

    }

}
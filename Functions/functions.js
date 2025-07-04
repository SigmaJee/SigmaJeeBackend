import { User, UserTest, Test } from "../Model/model.js"
import nodemailer from "nodemailer"
import dotenv from "dotenv"
import PDFDocument from "pdfkit"
import path from "path"
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
        res.cookie("user", JSON.stringify({
            Email: user.Email,
            Name: user.Name,
            id: user._id,
        }), {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({ message: "Login Successfull" ,userId:user._id});
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
    const AllTests = await Test.find();
    const Newdata = await UserTest.create({
        UserId: newUser._id,
        Attempted: [],
        UnAttempted: AllTests
    })
    if (!newUser) {
        console.log("Failed to create user");
        return res.status(404).json({ message: "Failed to create User" });
    }
    console.log(newUser);
    return res.status(200).json({mess:"User Created",userId:newUser._id});
}
export const DeleteUser = async (req, res) => {
    const { Email } = req.body;
    try {
        await User.deleteOne({ Email });
        return res.status(200).json("User Deleted");
    } catch (error) {
        console.log("Error in deleting");
        return res.status(200).json("Deletion failed");
    }

}
export const GiveUser = async (req, res) => {
    try {
        const { Email } = req.body;
        const user = await User.findOne({ Email }).lean(); // ✅

        console.log("USER FOUND:", user);

        if (!user) {
            return res.status(404).json({ mess: "No user found" });
        }

        return res.status(200).json({
            mess: "Sent the User",
            userId: user._id
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mess: "Error" });
    }
};



export const CreateTest = async (req, res) => {
    const { Title, Subject } = req.body;

    try {
        const NewTest = { Title, Subject, CreatedAt: Date.now() };
        const CreatedTest = await Test.create(NewTest);
        console.log(CreatedTest);
        console.log(CreatedTest._id);
        res.cookie("id", CreatedTest._id, {
            sameSite: true,
            httpOnly: true,
        })
        return res.status(200).json({ mess: "Created", id: CreatedTest._id })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ mess: "Failed to create" })
    }
}
export const GetAllTests = async (req, res) => {
    try {
        const AllTests = await Test.find();
        return res.status(200).json({ mess: "Got all tests", AllTests: AllTests });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ mess: "Failed to get all tests" });
    }
}
export const EditPaper = async (req, res) => {
    try {
        const { Statements, Saved, Options, Answers, duration, userId, id } = req.body;
        const test = await Test.findOne({ _id: id });
        if (!test) return res.status(400).json({ mess: "Paper not found" });

        const ques = [];
        for (let i = 0; i < 100; i++) {
            if (Saved[i]) {
                ques.push({
                    Statement: Statements[i],
                    Option: Options[i],
                    Answer: Answers[i]
                });
            }
        }
        test.Questions = ques;
        test.Duration = duration;
        console.log(userId);
        await test.save();
        const userTest = await UserTest.findOne({ UserId: userId });
        console.log(UserTest);
        const created = userTest.Created;
        created.push(test);
        console.log(userTest);
        await userTest.save();
        console.log("Updated Test:", test);
        return res.status(200).json({ mess: "Test updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ mess: "Server error" });
    }
};
export const DeletAll = async (req, res) => {
    try {
        await UserTest.deleteMany({});
        await User.deleteMany({});
        await Test.deleteMany({});
        return res.status(200).json({ mess: "All tests deleted" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mess: "Not deleted", error });
    }
}

export const GetAll = async (req, res) => {
    try {
        const AllTests = await Test.find();
        const AllUsers = await User.find();
        const AllUserTests = await UserTest.find();
        return res.status(200).json({ AllUserTests, AllUsers, AllTests });

    } catch (error) {
        return res.status(400).json({});

    }
}
export const GetAllUserTest = async (req, res) => {
    try {
        const userCookie = req.cookies.user;

        if (!userCookie) {
            return res.status(200).json({ message: "No user cookie found" });
        }

        let user;
        try {
            user = JSON.parse(userCookie);
        } catch (err) {
            return res.status(400).json({ message: "Invalid user cookie format" });
        }

        const id = user.id;

        const allUserTests = await UserTest.findOne({ UserId: id });

        if (!allUserTests) {
            return res.status(404).json({ message: "User tests not found" });
        }

        return res.status(200).json({
            Attempted: allUserTests.Attempted,
            UnAttempted: allUserTests.UnAttempted
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const MarkTestAsAttempted = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Cookies:", req.cookies);

        const { testid } = req.body;
        if (!testid) return res.status(400).json({ message: "testid missing in body" });
        const userCookie = req.cookies.user;
        let user;
        try {
            user = JSON.parse(userCookie);
        } catch (err) {
            return res.status(400).json({ message: "Invalid user cookie format" });
        }
        const UserId = user.id;
        if (!UserId) return res.status(401).json({ message: "User not authenticated" });
        console.log(UserId);
        const TesttoAttempt = await Test.findById(testid);
        if (!TesttoAttempt) return res.status(404).json({ message: "Test not found" });

        const UserTests = await UserTest.findOne({ UserId });
        if (!UserTests) return res.status(404).json({ message: "User tests not found" });

        TesttoAttempt.Attempts += 1;
        await TesttoAttempt.save();

        UserTests.UnAttempted = UserTests.UnAttempted.filter(
            (test) => test && test._id.toString() !== testid
        );
        UserTests.Attempted.push(TesttoAttempt);

        await UserTests.save();

        return res.status(200).json({ message: "Test marked as attempted" });
    } catch (err) {
        console.error("Error in MarkTestAsAttempted:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
export const GetTest = async (req, res) => {
    const { id } = req.body;
    const TestPaper = await Test.findById(id);
    if (!TestPaper) return res.status(404).json({ mess: "Test Not found" });
    const AllQuestions = TestPaper.Questions;
    const statements = [];
    const options = [];
    for (let question of AllQuestions) {
        statements.push(question.Statement);
        options.push(question.Option);
    }
    console.log(statements);
    console.log(options);
    console.log(statements.length);

    return res.status(200).json({ message: "TestPaper", Statements: statements, Options: options, len: statements.length });
}
export const GetCreatedTests = async (req, res) => {
    try {
        const { UserId } = req.body;
        const UserTests = await UserTest.findOne({ UserId });
        const created = UserTests.Created;
        console.log(created);
        return res.status(200).json({ created: created });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ mess: "hello" });
    }

}

import PDFDocument from "pdfkit";

export const GeneratePdf = async (req, res) => {
  const { paperData } = req.body;

  try {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    let chunks = [];

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=TestPaper.pdf");

    doc.on("data", chunk => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.end(pdfBuffer);
    });

    // 🔷 HEADER
    doc.fontSize(16).text("SigmaJEE");
    doc.moveDown();
    doc.fontSize(10).text(`Target: JEE (Main + Advanced) 2025 | Paper: ${paperData.Title || "Mock Test"}`, { align: "right" });
    doc.moveDown(0.5);
    doc.fontSize(14).text(`Time: ${paperData.Duration || 180} minutes`);
    doc.moveDown();

    // 🔷 Questions
    paperData.Questions.forEach((q, index) => {
      doc.moveDown(0.5);
      doc.fontSize(12).text(`${index + 1}. ${q.Statement}`);

      q.Option.forEach((opt, i) => {
        const optChar = String.fromCharCode(65 + i);
        doc.fontSize(11).text(`   (${optChar}) ${opt}`);
      });

      doc.moveDown();
    });

    doc.end();

  } catch (err) {
    console.error("PDF Generation Error:", err);
    return res.status(500).json({ message: "Failed to generate PDF" });
  }
};

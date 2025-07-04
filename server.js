import e from "express";
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv"
import router from "./Routes/route.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = e();
app.use(e.json());
app.use(cookieParser());
app.use(cors({
  origin: ["https://sigmajeeoff.netlify.app"],
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("Backend is running!");
});
app.get("/test-cookie", (req, res) => {
  res.cookie("demo", "working", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 10000,
  });
  res.send("Cookie test");
});


try {
    const Uri = process.env.URI;
    await mongoose.connect(Uri);
    console.log("Mongo Db Connected Successfully");
} catch (error) {
    console.log("Error in Connecting to Mongo DB " + error);

}
app.use("/api/user",router);
const Port = process.env.PORT || 10000;
app.listen(Port, () => {
    console.log(`Server running on port ${Port}`);
})
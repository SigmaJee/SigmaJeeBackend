import e from "express";
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv"
import router from "./Routes/route.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = e();
app.use(e.json());
app.use(cors({
  origin: ["http://localhost:5173", "https://sigmajeeoff.netlify.app"],
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use(cookieParser());
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
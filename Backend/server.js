import express from "express";
import dotenv from "dotenv";    
import cors from "cors";        
import mongoose from "mongoose";
import quizRoutes from "./routes/quizRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
dotenv.config();
   
const app=express();

app.use(cors());
app.use(express.json());

app.use("/api/quizzes",quizRoutes);
app.use("/api/quizzes",questionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/export", exportRoutes);

app.get("/",(req,res)=>{
    res.json({message:"Hello from server"});
});
 
// app.get("/",(req,res)=>{
//     res.send("Hello connected");
// }) 

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Connected to MongoDB");
}).catch(err=>console.log(err));

const PORT=process.env.PORT || 8000;  

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

import mongoose from "mongoose";

const resultSchema=new mongoose.Schema({
    quizId:{
        type:mongoose.Schema.Types.ObjectId,    
        ref:"Quiz",
        required:true,          
    },
    user:{
        type:String,
        default:"Guest",
    },
    score:{
        type:Number,
        required:true,
    },
    total:{
        type:Number,
        required:true,
    },
    percentage:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    }   
});
const Result=mongoose.model("Result",resultSchema);
export default Result;
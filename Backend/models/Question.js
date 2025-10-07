import mongoose from "mongoose";


    const qestionSchema = new mongoose.Schema({
  quizId: { type: String, required: true },
  questionText: { type: String, required: true },
  options: [String],
  correctOptionIndex: { type: Number, required: true },
});
const Question=mongoose.model("Question",qestionSchema);
export default Question;
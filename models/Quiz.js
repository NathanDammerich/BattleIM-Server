import mongoose from "mongoose";
const Schema = mongoose.Schema;

const quizSchema = Schema({
  minimumScore: Number,
  sport: { type: Schema.Types.ObjectId, ref: "Sport" },
  rules: String,
  questions: [
    {
      question: String,
      answers: [
        {
          answer: String,
          correct: Boolean,
        },
      ],
    },
  ],
});

var Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;

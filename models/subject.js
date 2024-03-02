import mongoose from "mongoose";
const { Schema } = mongoose;
const subjectSchema = new Schema({
  subjectName: {
    type: String,
    required: true,
    trim: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  degree: {
    type: String
  },
  totalLectures: {
    type: Number,
    default: 20,
  },
  year: {
    type: String,
    required: true,
  },
  term: {
    type: String,
    required: true,
  },
  credit: {
    type: String,
    required: true,
  },
  creditHour: {
    type: String,
    required: true,
  },

  attendence: {
    type: Schema.Types.ObjectId,
    ref: "attendence",
  },
});

export default mongoose.model("subject", subjectSchema);

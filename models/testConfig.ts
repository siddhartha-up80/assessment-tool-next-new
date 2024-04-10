import mongoose, { Document, Schema, Types } from "mongoose";

export interface TestConfigT extends Document {
  assessmentId: Types.ObjectId;
  continuationAssessmentId?: Types.ObjectId;
  jobDescription: string;
  questionsPerPage: number;
  timeLimit: number;
  hiringType: "Public" | "Campus";
  useTestLink: boolean;
  assignUsers?: boolean;
  emailValidation?: boolean;
  numberOfQuestions: number;
  minimumPassingMarks: number;
}

const TestConfigSchema = new Schema<TestConfigT>({
  assessmentId: {
    type: Schema.Types.ObjectId,
    ref: "Assessment",
    required: true,
  },
  continuationAssessmentId: {
    type: Schema.Types.ObjectId,
    ref: "Assessment",
  },
  jobDescription: {
    type: String,
  },
  questionsPerPage: {
    type: Number,
  },
  timeLimit: {
    type: Number,
  },
  hiringType: {
    type: String,
    enum: ["Public", "Campus"],
  },
  useTestLink: {
    type: Boolean,
  },
  assignUsers: {
    type: Boolean,
    optional: true,
  },
  emailValidation: {
    type: Boolean,
    optional: true,
  },
  numberOfQuestions: {
    type: Number,
  },
  minimumPassingMarks: {
    type: Number,
  },
});

export default mongoose.models?.TestConfig ||
  mongoose.model<TestConfigT>("TestConfig", TestConfigSchema);

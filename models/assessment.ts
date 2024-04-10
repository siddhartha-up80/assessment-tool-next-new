import mongoose, { Document, Schema, Types } from "mongoose";

export interface AssessmentT extends Document {
  jobRecruiterId: Types.ObjectId;
  role: string;
  industry: string;
  skillsTags: string[];
  yearsOfExperience: number;
  publishFrom: Date;
  publishTo: Date;
}

const AssessmentSchema = new Schema<AssessmentT>({
  jobRecruiterId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  role: {
    type: String,
  },
  industry: {
    type: String,
  },
  skillsTags: {
    type: [String],
  },
  yearsOfExperience: {
    type: Number,
  },
  publishFrom: {
    type: Date,
  },
  publishTo: {
    type: Date,
  },
});
AssessmentSchema.set("timestamps", true);
export default mongoose.models?.Assessment ||
  mongoose.model<AssessmentT>("Assessment", AssessmentSchema);

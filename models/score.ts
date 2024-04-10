import mongoose, { Document, Schema, Types } from "mongoose";

export interface ScoreT extends Document {
  testUserId: Types.ObjectId;
  testUserEmail: String;
  assessmentId: Types.ObjectId;
  scoreType: "Functional" | "Behavioral" | "JdResume";
  score: number;
  comments?: string;
}

const ScoreSchema = new Schema<ScoreT>({
  testUserId: {
    type: Schema.Types.ObjectId,
    ref: "TestUser",
    required: true,
  },
  testUserEmail: {
    type: Schema.Types.ObjectId,
    ref: "TestUser",
    required: true,
  },
  assessmentId: {
    type: Schema.Types.ObjectId,
    ref: "Assessment",
    required: true,
  },
  scoreType: {
    type: String,
    enum: ["Functional", "Behavioral", "JdResume"],
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  comments: {
    type: String,
  },
});
ScoreSchema.set("timestamps", true);
export default mongoose.models?.Score ||
  mongoose.model<ScoreT>("Score", ScoreSchema);

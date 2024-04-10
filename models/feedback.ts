import mongoose, { Document, Schema, Types } from "mongoose";

export interface FeedbackT extends Document {
  userId: Types.ObjectId;
  testId: Types.ObjectId;
  message: string;
  rating: number;
}

const feedbackSchema = new Schema<FeedbackT>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "TestUser",
    required: true,
  },
  testId: {
    type: Schema.Types.ObjectId,
    ref: "Tests",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
});

export default mongoose.models?.Feedback ||
  mongoose.model<FeedbackT>("Feedback", feedbackSchema);

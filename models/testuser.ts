import mongoose, { Document, Schema, Types } from "mongoose";

export interface TestUserT extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  resumeLink?: string;
  phoneNumber?: string;
  assessmentId: Types.ObjectId;
  userId: Types.ObjectId;
}

const TestUserSchema = new Schema<TestUserT>({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  resumeLink: {
    type: String,
  },
  phoneNumber: {
    type: String,
    optional: true,
  },
  assessmentId: {
    type: Schema.Types.ObjectId,
    ref: "Assessment",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
TestUserSchema.set("timestamps", true);
export default mongoose.models?.TestUser ||
  mongoose.model<TestUserT>("TestUser", TestUserSchema);

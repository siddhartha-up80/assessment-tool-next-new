import mongoose, { Document, Schema, Types } from "mongoose";

export interface OtpT extends Document {
  emailId: string;
  otp: string;
}

const OtpSchema = new mongoose.Schema({
  emailId: {
    type: String,
    unique: true,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
});
OtpSchema.set("timestamps", true);
export default mongoose.models?.Otp || mongoose.model<OtpT>("Otp", OtpSchema);

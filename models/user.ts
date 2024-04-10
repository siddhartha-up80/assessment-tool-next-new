import mongoose, { Document, Schema, Types } from "mongoose";

export interface UserT extends Document {
  _id?:string,
  emailId: string;
  password: string;
  companyname?: string;
  fullname: string;
  phoneNumber?: string;
  type: "seeker" | "recruiter";
}

const userSchema = new Schema<UserT>({
  emailId: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  companyname: {
    type: String,
  },
  fullname: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  type: {
    type: String,
    default: "seeker",
    enum: ["seeker", "recruiter"],
  },
});

userSchema.set("timestamps", true);
export default mongoose.models?.User || mongoose.model<UserT>("User", userSchema);

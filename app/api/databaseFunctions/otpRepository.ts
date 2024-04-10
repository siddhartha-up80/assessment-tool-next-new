"use server";
import Otp, { OtpT } from "@/models/otp";

interface OtpResponse {
  data: OtpT | String | null;
  error: string | null;
}

async function isOtpT(obj: any): obj is OtpT {
  return "emailId" in obj && "otp" in obj;
}

async function AddOtp(otp: Partial<OtpT>): Promise<OtpResponse> {
  try {
    const newOtp = await Otp.create(otp);
    await newOtp.save();
    return { data: newOtp, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function GetOtpById(id: string): Promise<OtpResponse> {
  try {
    const otp = await Otp.findById(id);
    if (!otp) return { data: null, error: "Not data available" };
    return { data: otp, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function GetOtpByEmail(email: string): Promise<OtpResponse> {
  try {
    const otp = await Otp.findOne({ emailid: email });
    if (!otp) return { data: null, error: "Not data available" };
    return { data: otp, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function UpdateOtpById(
  id: string,
  changes: Partial<OtpT>
): Promise<OtpResponse> {
  try {
    const otp = await Otp.findByIdAndUpdate(id, changes, { new: true }).select(
      "-otp"
    );
    if (!otp) return { data: null, error: "Not data available" };
    return { data: otp, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function UpdateOtpByEmail(
  emailid: string,
  changes: Partial<OtpT>
): Promise<OtpResponse> {
  try {
    await Otp.findOneAndUpdate({ emailid }, changes, { new: true });
    return {
      data: `Email is updated and otp is send to the email id ${changes.emailId}`,
      error: null,
    };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function DeleteOtpById(id: string): Promise<OtpResponse> {
  try {
    const otp = await Otp.findByIdAndDelete(id);
    if (!otp) return { data: null, error: "Not data available" };
    return { data: `otp with id ${id} has been deleted`, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function DeleteOtpByEmail(email: string): Promise<OtpResponse> {
  try {
    const otp = await Otp.findOneAndDelete({ emailid: email });
    if (!otp) return { data: null, error: "Not data available" };
    return { data: `otp with email ${email} has been deleted`, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export {
  DeleteOtpByEmail,
  DeleteOtpById,
  UpdateOtpByEmail,
  UpdateOtpById,
  GetOtpByEmail,
  GetOtpById,
  AddOtp,
  isOtpT,
};

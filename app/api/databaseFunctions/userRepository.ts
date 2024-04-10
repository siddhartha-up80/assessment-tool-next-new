"use server";
import User, { UserT } from "@/models/user";

interface UserResponse {
  data: UserT[] | string | UserT | null;
  error: string | null;
}

async function AddUser(user: Partial<UserT>): Promise<UserResponse> {
  try {
    const newUser = await User.create(user);
    await newUser.save();
    return { data: newUser, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function GetUserById(id: string): Promise<UserResponse> {
  try {
    const user = await User.findById(id).select("-password");
    if (!user) return { data: null, error: "Not data available" };
    return { data: user, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function GetAllUsers(): Promise<UserResponse> {
  try {
    const users = await User.find().select("-password");
    if (users.length === 0) return { data: null, error: "Not data available" };
    return { data: users, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function GetUserByEmail(email: string): Promise<UserResponse> {
  try {
    const user = await User.findOne({ emailid: email });
    if (!user) return { data: null, error: "Not data available" };
    return { data: user, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function UpdateUserById(
  id: string,
  changes: Partial<UserT>
): Promise<UserResponse> {
  try {
    const user = await User.findByIdAndUpdate(id, changes, { new: true });
    if (!user) return { data: null, error: "Not data available" };
    return { data: user, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function UpdateUserByEmail(
  email: string,
  changes: Partial<UserT>
): Promise<UserResponse> {
  try {
    const user = await User.findOneAndUpdate({ emailid: email }, changes, {
      new: true,
    });
    if (!user) return { data: null, error: "Not data available" };
    return { data: user, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function DeleteUserById(id: string): Promise<UserResponse> {
  try {
    const isDeleted = await User.findByIdAndDelete(id);
    if (!isDeleted) return { data: null, error: "Not data available" };
    return { data: `User with id ${id} is deleted`, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function DeleteUserByEmail(email: string): Promise<UserResponse> {
  try {
    const isDeleted = await User.findOneAndDelete({ emailid: email });
    if (!isDeleted) return { data: null, error: "Not data available" };
    return { data: `User with email ${email} is deleted`, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function isUserT(obj: any): obj is UserT {
  // Implement your type guard logic here
  // For example, check if obj has all properties required by UserT
  return obj && typeof obj.someProperty === "string"; // Replace with actual properties of UserT
}

export {
  DeleteUserByEmail,
  DeleteUserById,
  UpdateUserByEmail,
  UpdateUserById,
  AddUser,
  GetUserByEmail,
  GetUserById,
  GetAllUsers,
  isUserT,
};

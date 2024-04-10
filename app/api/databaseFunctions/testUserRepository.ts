"use server";
import TestUser, { TestUserT } from "@/models/testuser";

interface TestUserResponse {
  data: TestUserT | null;
  error: string | null;
}

interface TestUsersResponse {
  data: TestUserT[] | null;
  error: string | null;
}

async function AddTestUser(user: Partial<TestUserT>): Promise<TestUserResponse> {
  try {
    const newUser = await TestUser.create(user);
    await newUser.save();
    return { data: newUser, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function GetUserById(id: string): Promise<TestUserResponse> {
  try {
    const user = await TestUser.findById(id);
    if (!user) return { data: null, error: "Not data available" };
    return { data: user, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function getTestUsersByAssessmentId(id: string): Promise<TestUsersResponse> {
  try {
    const user = await TestUser.find({assessmentId: id});
    if (!user) return { data: null, error: "Not data available" };
    return { data: user, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export {AddTestUser, GetUserById, getTestUsersByAssessmentId};
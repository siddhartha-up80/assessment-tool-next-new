"use server";
import TestConfig, { TestConfigT } from "@/models/testConfig";

interface TestConfigResponse {
  data: TestConfigT | null;
  error: string | null;
}

async function addTestConfig(
  testConfig: Partial<TestConfigT>
): Promise<TestConfigResponse> {
  try {
    const newTestConfig = new TestConfig(testConfig);
    await newTestConfig.save();
    return { data: newTestConfig, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function getTestConfigByAssessmentId(
  assessmentId: string
): Promise<TestConfigResponse> {
  try {
    const testConfig = await TestConfig.findOne({ assessmentId: assessmentId });
    return testConfig;
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function updateByAssessmentId(
  assessmentId: string,
  update: Partial<TestConfigT>
): Promise<TestConfigResponse> {
  try {
    const updatedTestConfig = await TestConfig.findOneAndUpdate(
      { assessmentId: assessmentId },
      update,
      { new: true } // This option returns the updated document
    );
    return updatedTestConfig;
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function deleteByAssessmentId(
  assessmentId: string
): Promise<{ deletedCount: number }> {
  try {
    const result = await TestConfig.deleteOne({ assessmentId: assessmentId });
    return { deletedCount: result.deletedCount };
  } catch (error) {
    console.error(error);
    return { deletedCount: 0 };
  }
}

export {
  addTestConfig,
  getTestConfigByAssessmentId,
  updateByAssessmentId,
  deleteByAssessmentId,
};

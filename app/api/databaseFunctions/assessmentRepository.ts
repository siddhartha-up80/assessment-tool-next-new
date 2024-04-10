"use server";
import Assessment, { AssessmentT } from "@/models/assessment";

interface AssessmentResponse {
  data: AssessmentT | null;
  error: string | null;
}
interface AssessmentsResponse {
  data: AssessmentT[] | null;
  error: string | null;
}

async function AddAssessment(assessment: Partial<AssessmentT>): Promise<AssessmentResponse> {
  try {
    const newassessment = await Assessment.create(assessment);
    await newassessment.save();
    return { data: newassessment, error: null };
  } catch (error: any) {
    console.log(error.message);
    return { data: null, error: error.message };
  }
}

async function UpdateAssessmentById(
  id: string,
  changes: any
): Promise<AssessmentResponse> {
  try {
    const updatedassessment = await Assessment.findByIdAndUpdate(id, changes, {
      new: true,
    });
    if (!updatedassessment) return { data: null, error: "Not data available" };
    return { data: updatedassessment, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function GetAssessmentById(id: string): Promise<AssessmentResponse> {
  try {
    const assessment = await Assessment.findById(id);
    if (!assessment) return { data: null, error: "Not data available" };
    return { data: assessment, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function GetAssessmentByConfig(config: any): Promise<AssessmentResponse> {
  try {
    const assessment = await Assessment.findOne(config);
    if (assessment.length === 0) {
      return { data: null, error: "No test found for this configuration" };
    }
    return { data: assessment, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function GetAllAssessments(): Promise<AssessmentsResponse> {
  try {
    const assessment = await Assessment.find();
    if (assessment.length === 0) {
      return { data: null, error: "Not assessement available" };
    }
    return { data: assessment, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function GetAllRecruiterAssessments(
  jobRecruiterId: string
): Promise<AssessmentsResponse> {
  try {
    const assessments = await Assessment.find({
      jobRecruiterId: jobRecruiterId,
    });
    if (assessments.length === 0) {
      return { data: null, error: "Not assessement available" };
    }
    return { data: assessments, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function DeleteAssessmentById(id: string) {
  try {
    const assessment = await Assessment.findByIdAndDelete(id);
    if (!assessment) return { data: null, error: "Not data available" };
    return { data: `assessment with id ${id} is deleted`, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function GetAllActiveAssessments(): Promise<AssessmentsResponse> {
  const currentDate = new Date();
  try {
    const assessment = await Assessment.find({
      $and: [
        { publishFrom: { $lte: currentDate } },
        {
          $or: [
            { publishTo: null }, // Assessments with infinite publishTo
            { publishTo: { $gte: currentDate } }, // Assessments with publishTo in the future
          ],
        },
      ],
    });
    return { data: assessment, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function GetAllValidActiveAssessments(
  providedEmail: string
): Promise<AssessmentsResponse> {
  const currentDate = new Date();
  try {
    const assessments = await Assessment.aggregate([
      {
        $match: {
          $and: [
            { publishFrom: { $lte: currentDate } },
            {
              $or: [
                { publishTo: null }, // Assessments with infinite publishTo
                { publishTo: { $gte: currentDate } }, // Assessments with publishTo in the future
              ],
            },
          ],
        },
      },
      {
        $lookup: {
          from: "testuser", // Assuming the collection name for TestUser is "testusers"
          localField: "_id",
          foreignField: "assessmentId",
          as: "testUsers",
        },
      },
      {
        $match: {
          testUsers: {
            $elemMatch: {
              email: { $ne: providedEmail },
            },
          },
        },
      },
    ]);
    return { data: assessments, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function GetAssessmentsWithMatchingEmail(
  providedEmail: string
): Promise<AssessmentsResponse> {
  const currentDate = new Date();
  try {
    const assessments = await Assessment.aggregate([
      {
        $match: {
          $and: [
            { publishFrom: { $lte: currentDate } },
            {
              $or: [
                { publishTo: null }, // Assessments with infinite publishTo
                { publishTo: { $gte: currentDate } }, // Assessments with publishTo in the future
              ],
            },
          ],
        },
      },
      {
        $lookup: {
          from: "testuser",
          localField: "_id",
          foreignField: "assessmentId",
          as: "testUsers",
        },
      },
      {
        $match: {
          testUsers: {
            $elemMatch: {
              email: providedEmail,
            },
          },
        },
      },
    ]);
    return { data: assessments, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

async function GetAssessmentWithValidTimeline(
  assessmentId: string
): Promise<AssessmentsResponse> {
  const currentDate = new Date();
  try {
    const assessment = await Assessment.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(assessmentId),
          $and: [
            { publishFrom: { $lte: currentDate } },
            {
              $or: [
                { publishTo: null }, // Assessments with infinite publishTo
                { publishTo: { $gte: currentDate } }, // Assessments with publishTo in the future
              ],
            },
          ],
        },
      },
    ]);
    return { data: assessment, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export {
  AddAssessment,
  UpdateAssessmentById,
  GetAssessmentById,
  GetAssessmentByConfig,
  GetAllAssessments,
  GetAllRecruiterAssessments,
  DeleteAssessmentById,
  GetAllActiveAssessments,
  GetAllValidActiveAssessments,
  GetAssessmentsWithMatchingEmail,
  GetAssessmentWithValidTimeline,
};

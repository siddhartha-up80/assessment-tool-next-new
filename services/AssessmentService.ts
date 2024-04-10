import { NextApiRequest, NextApiResponse } from "next";
import {
  createFunctionalPrompt,
  createBehavioralPrompt,
  createJdResumeScorePrompt,
  createOneQuestionPrompt,
  createInstructionsPage,
} from "../api/assessment/constantsAssessment"; // Adjust the path as necessary
import OpenAI from "openai";
import { AddScore } from "../api/databaseFunctions/scoreRepository";
import {
  AddAssessment,
  DeleteAssessmentById,
  GetAllRecruiterAssessments,
  GetAllValidActiveAssessments,
  GetAssessmentById,
  GetAssessmentWithValidTimeline,
  UpdateAssessmentById,
} from "../api/databaseFunctions/assessmentRepository";
import {
  addQuestions,
  deleteQuestionsByAssessmentId,
  getQuestionsWithAnswers,
  getQuestionsWithoutAnswers,
} from "../api/databaseFunctions/questionRepository";
import questions, { QuestionT } from "@/app/models/questions";
// import { isNumberObject } from "util/types";
import {
  addTestConfig,
  deleteByAssessmentId,
  getTestConfigByAssessmentId,
  updateByAssessmentId,
} from "../api/databaseFunctions/testConfigRepository";
import { Types } from "mongoose";
import { AssessmentT } from "@/app/models/assessment";
import testConfig, { TestConfigT } from "@/app/models/testConfig";
import { getTestUsersByAssessmentId } from "../api/databaseFunctions/testUserRepository";
// import nodemailer from "nodemailer";

import pThrottle from "p-throttle";
import { isNumber } from "util";
import dbConnect from "../api/utils/dbConnect";
// import { isNumberObject } from "node:util/types";

console.log(process.env.OPENAI_API_KEY);

const configuration = {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY as string,
  dangerouslyAllowBrowser: true,
};
const openai = new OpenAI(configuration);

const throttle = pThrottle({
  limit: 2,
  interval: 1000,
});

const throttledHandleGenerate = throttle(async (prompt: string) => {
  const query = `${prompt}`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: query }],
      model: "gpt-4",
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    const parsableJSONresponse = chatCompletion.choices[0].message.content;
    return JSON.parse(parsableJSONresponse || "");
  } catch (error) {
    console.error(error);
    return null;
  }
});

const Openairesponse = async (industry: string, experience: string, role: string, techstack: string, type: string, jd: string, resume: string) => {
//   const { industry, experience, role, techstack, type, jd, resume } = req.body;

  let prompt = null;

  if (type === "functional") {
    prompt = createFunctionalPrompt(role, techstack, industry, experience);
  } else if (type === "behavioral") {
    prompt = createBehavioralPrompt(techstack);
  } else if (type === "jdresumescore") {
    prompt = createJdResumeScorePrompt(jd, resume);
  } else if (type === "onequestion") {
    prompt = createOneQuestionPrompt(industry, role, techstack, experience);
  }
  try {
    if (prompt) {
      const response = await throttledHandleGenerate(prompt);

      if (response) {
        return response;
      } else {
        // Handle the case where response is null
      }
    }
  } catch (error: any) {
    return error.message;
  }
};

export async function hello(){
    return "hello world";
}

// const HandleGenerate = async (prompt: string): Promise<string | null> => {
//   const configuration = {
//     apiKey: process.env.OPENAI_API_KEY1 as string,
//     dangerouslyAllowBrowser: true,
//   };
//   const openai = new OpenAI(configuration);
//   const query = `${prompt}`;

//   try {
//     const chatCompletion = await openai.chat.completions.create({
//       messages: [{ role: "user", content: query }],
//       model: "gpt-4",
//       temperature: 0.5,
//       top_p: 1,
//       frequency_penalty: 0,
//       presence_penalty: 0,
//     });
//     const parsableJSONresponse = chatCompletion.choices[0].message.content;
//     return JSON.parse(parsableJSONresponse || "");
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };

// const Openairesponse = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { industry, experience, role, techstack, type, jd, resume } = req.body;

//   let prompt = null;

//   if (type === "functional") {
//     prompt = createFunctionalPrompt(role, techstack, industry, experience);
//   } else if (type === "behavioral") {
//     prompt = createBehavioralPrompt(techstack);
//   } else if (type === "jdresumescore") {
//     prompt = createJdResumeScorePrompt(jd, resume);
//   } else if (type === "onequestion") {
//     prompt = createOneQuestionPrompt(industry, role, techstack, experience);
//   }
//   try {
//     if (prompt) {
//       const response = throttledHandleGenerate(prompt);

//       if (response) {
//         return response;
//       } else {
//       }
//     }
//   } catch (error: any) {
//     return error.message;
//   }
// };

async function checkAnswers(
  testId: string,
  providedAnswers: Partial<QuestionT>[],
  userId: string,
  scoreType: "Functional" | "Behavioral" | "JdResume"
): Promise<number | string> {
  const questions = await getQuestionsWithAnswers(testId);
  if (!questions) {
    return "Test does not exist";
  }
  let score = 0;
  questions.forEach((question) => {
    const correctAnswerId = question.answerId.toString();
    const providedAnswerId = providedAnswers[question._id].toString();

    if (correctAnswerId === providedAnswerId) {
      score++;
    }
  });
  score = (score / questions.length) * 10;

  const userIdObjectId = new Types.ObjectId(userId);
  const testIdObjectId = new Types.ObjectId(testId);

  await AddScore({
    testUserId: userIdObjectId,
    assessmentId: testIdObjectId,
    scoreType: scoreType,
    score: score,
  });
  return score;
}

async function CheckAssessment(
  testUserId: string,
  assessmentId: string,
  functionalAns: Partial<QuestionT>[] | null,
  behavioralAns: Partial<QuestionT>[] | null,
  resume: any | null
): Promise<any> {
  try {
    let scoreFunctional = 0;
    let scoreBehavioral = 0;

    if (functionalAns) {
      const functionalScore = await checkAnswers(
        assessmentId,
        functionalAns,
        testUserId,
        "Functional"
      );
      if (isNumber(functionalScore)) {
        scoreFunctional = functionalScore;
      } else {
        return functionalScore;
      }
    }
    if (behavioralAns) {
      const behavioralScore = await checkAnswers(
        assessmentId,
        behavioralAns,
        testUserId,
        "Behavioral"
      );
      if (isNumber(behavioralScore)) {
        scoreBehavioral = behavioralScore;
      } else {
        return behavioralScore;
      }
    }
  } catch (error: any) {
    return error.message;
  }
}

async function GetAssessmentsRecruiter(recruiterId: string) {
  try {
    const assessments = await GetAllRecruiterAssessments(recruiterId);
    return assessments;
  } catch (error: any) {
    return error.message;
  }
}

async function GetAssessmentsSeeker(userId: string) {
  try {
    const assessments = await GetAllValidActiveAssessments(userId);
    return assessments;
  } catch (error: any) {
    return error.message;
  }
}

async function GetTestConfig(userId: string) {
  try {
    const testConfig = await getTestConfigByAssessmentId(userId);
    if (!testConfig.data) {
      return testConfig.error;
    }
    return testConfig;
  } catch (error: any) {
    return error.message;
  }
}

async function GetInstructionsPage(userId: string) {
  try {
    const testConfig = await getTestConfigByAssessmentId(userId);
    if (!testConfig.data) {
      return testConfig.error;
    }
    const instructions = createInstructionsPage(testConfig.data);
    return instructions;
  } catch (error: any) {
    return error.message;
  }
}

async function GetQuestionsForSeeker(AssessmentId: string) {
  try {
    const assessment = await GetAssessmentWithValidTimeline(AssessmentId);
    if (!assessment.data) {
      return assessment.error;
    }
    const questions = await getQuestionsWithoutAnswers(AssessmentId);
    return questions;
  } catch (error: any) {
    return error.message;
  }
}

async function GetQuestionsRecruiter(AssessmentId: string) {
  try {
    const assessment = await GetAssessmentById(AssessmentId);
    if (!assessment.data) {
      return assessment.error;
    }
    const questions = await getQuestionsWithAnswers(AssessmentId);
    return questions;
  } catch (error: any) {
    return error.message;
  }
}

async function PostAssessment(
  assessement: Partial<AssessmentT>,
  testConfig: Partial<TestConfigT>,
  questions: QuestionT[]
) {
  await dbConnect();
  try {
    const assessment = await AddAssessment(assessement);
    if (!assessment.data) {
      return assessment.error;
    }
    const config = await addTestConfig({ ...testConfig, assessmentId: assessment.data.id });
    if (!config.data) {
      return "Config not saved";
    }
    questions.map(question => ({ ...question, assessmentId: assessment.data?.id }));
    const question = await addQuestions(questions);
    if (!question) {
      return "questions not saved";
    }
    return assessment;
  } catch (error: any) {
    return error.message;
  }
}

async function UpdateAssessment(
  assessmentId: string,
  assessement: Partial<AssessmentT>,
  testConfig: Partial<TestConfigT>,
  questions: QuestionT[]
) {
  try {
    const assessment = await UpdateAssessmentById(assessmentId, assessement);
    if (!assessment.data) {
      return assessment.error;
    }
    const config = await updateByAssessmentId(assessmentId, testConfig);
    if (!config.data) {
      return "Config not saved";
    }
    const questionNo = deleteQuestionsByAssessmentId(assessmentId);
    const question = await addQuestions(questions);
    if (!question && !questionNo) {
      return "questions not saved";
    }
    return assessment;
  } catch (error: any) {
    return error.message;
  }
}

async function DeleteAssessment(assessmentId: string) {
  try {
    const assessment = await DeleteAssessmentById(assessmentId);
    if (!assessment.data) {
      return assessment.error;
    }
    const config = await deleteByAssessmentId(assessmentId);
    if (!config) {
      return "Config not saved";
    }
    const questionNo = deleteQuestionsByAssessmentId(assessmentId);
    if (!questionNo) {
      return "questions not saved";
    }
    return assessment;
  } catch (error: any) {
    return error.message;
  }
}

async function GetLeaderboard(assessmentId: string) {
  const testUsers = getTestUsersByAssessmentId(assessmentId);
}

interface RequestBody {
  infos: { emailid: string }[];
  emailsubject?: string;
  emailbody?: string;
}

// const SendEmail = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { infos, emailsubject, emailbody }: RequestBody = req.body;
//   try {
//     for (const info of infos) {
//       const { emailid } = info;
//       let transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASSWORD,
//         },
//       });

//       let mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: emailid,
//         subject: emailsubject || "Test Result",
//         html: `<html><h1>${
//           emailbody || "Congratulations!!! You have cleared the test"
//         }</h1></html>`,
//       };

//       await transporter.sendMail(mailOptions);
//     }

//     return res.status(200).json({
//       status: "success",
//       message: "Mails have been sent successfully.",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: "failed",
//       message: `Unknown error occurred: ${error}`,
//     });
//   }
// };

export  {
  Openairesponse,
  CheckAssessment,
  GetAssessmentsRecruiter,
  GetAssessmentsSeeker,
  GetTestConfig,
  GetInstructionsPage,
  GetQuestionsForSeeker,
  GetQuestionsRecruiter,
  PostAssessment,
  UpdateAssessment,
  DeleteAssessment,
  // SendEmail,
};

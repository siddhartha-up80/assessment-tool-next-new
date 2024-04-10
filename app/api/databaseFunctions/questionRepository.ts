"use server";
import Questions, { QuestionT } from "@/models/questions";

async function getQuestionsWithoutAnswers(
  assessmentId: string
): Promise<Partial<QuestionT>[] | null> {
  try {
    const questions = await Questions.find({
      assessmentId: assessmentId,
    }).select("-answerId");
    return questions;
  } catch (error: any) {
    return null;
  }
}

async function getQuestionsWithAnswers(
  assessmentId: string
): Promise<QuestionT[] | null> {
  try {
    const questions = await Questions.find({ assessmentId: assessmentId });
    return questions;
  } catch (error: any) {
    return null;
  }
}

async function addQuestions(
  questions: QuestionT[]
): Promise<QuestionT[] | null> {
  try {
    const question = await Questions.create(questions);
    return question;
  } catch (error: any) {
    return null;
  }
}

async function deleteQuestionsByAssessmentId(
  assessmentId: string
): Promise< Number| null> {
  try {
    const question = await Questions.deleteMany({assessmentId});
    return question.deletedCount;
  } catch (error: any) {
    return null;
  }
}

export { getQuestionsWithoutAnswers , getQuestionsWithAnswers, addQuestions, deleteQuestionsByAssessmentId};

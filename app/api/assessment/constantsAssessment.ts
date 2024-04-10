// prompts.ts

import { TestConfigT } from "@/app/models/testConfig";

export const createFunctionalPrompt = (
  role: string,
  techstack: string,
  industry: string,
  experience: string
) => {
  `
Develop a set of 25 comprehensive and challenging multiple-choice questions to evaluate candidates applying for the position of "${role}" within your team. The questions should cover a wide range of topics relevant to the "${role}" and "${techstack}" experience within the specified "${industry}" sector. Each question should have four answer options, with only one correct choice, and the incorrect choices should be challenging yet plausible to effectively assess the applicants. Please ensure that you avoid using numerical or alphabetical identifiers for the questions and choices, and pay attention to avoiding duplicate questions.

The questions should assess the candidates' knowledge, problem-solving abilities, and critical thinking skills related to the "${role}" and "${techstack}" experience within the "${industry}" sector. Your goal is to provide a comprehensive evaluation of the applicants' qualifications and expertise, ensuring that the questions are challenging yet fair, and reflect ${experience} in the ${industry} field.
  
Finally, present the questions, choices, and the correct answer option in a parsable JSON format as shown below:
  
[
{
"Question": "Enter the question here",
"Choice": ["Option 1", "Option 2", "Option 3", "Option 4"],
"CorrectChoice": "Correct answer from the given choices"
},
{
"Question": "Enter the question here",
"Choice": ["Option 1", "Option 2", "Option 3", "Option 4"],
"CorrectChoice": "Correct answer from the given choices"
},
...
  
Your questions should be well-structured, encompassing various aspects of the role, the tech stack, and industry-specific knowledge, while providing a rigorous assessment of the candidates' capabilities.
`;
};

export const createBehavioralPrompt = (techstack: string) => `
 "Identify the top organizational psychologists with expertise in ${techstack} areas of human behavior.
  You are a team of these psychologists working together. 
  You have been assigned a task to create an assessment to assess multiple job applicants. 
  The objective of this assessment is to assess & verify if the job applicants, who are applying for $role at a hierarchy level of $years of experience, possesses ${techstack} traits. Create a set of 15 multiple choice questions for this. Follow the benchmark of best global psychometric tests. Make sure that all the 15 questions are unique, have 4 confusing answer options but only 1 among the 4 is the right answer. The questions difficulty level should be expert level. Also identify & mention the right answer option below every question
  . Return response in the following parsable JSON format: 

  [
    {
      "Question": "question",
      "Choice": ["Choice", "Choice", "Choice", "Choice"],
      "CorrectChoice":  "correct ans from given choices"
    }
  ]
  and do not give number or alphabeticals to questions and choices like Question 1 2 3 Choice A B C D and correctChoice should be from given choices and duplicate questions.
   `;

export const createJdResumeScorePrompt = (jd: string, resume: string) => `
Act as teacher that gives marks out of 100 on the basis of matching of job description and resume of the student both of them are provided below(give total marks only not individually, no explanation).Return response in the number only

Resume -
${resume}
                                                                                       
JOB DESCRIPTION -
${jd}.
Return the response in JSON FORMAT AS GIVEN BELOW 
{
  "marks": your response 
}
`;

export const createOneQuestionPrompt = (
  industry: string,
  role: string,
  techstack: string,
  experience: string
) => `
You are world's top ${industry} professional expert. You need to hire a person for ${role} in your team with ${experience} of experience in ${techstack} in ${industry}. To do this, you need to assess multiple applicants against the benchmark of the knowledge & skills which an ideal professional in ${role} with ${experience} of experience in ${techstack} in $industry must possess. Create 1 multiple choice questions for this. Make sure that 1 question is unique, have 4 confusing answer options and only 1 among the 4 is the right answer. Also identify & mention the right answer option below every question.
  . Return response in the following parsable JSON format:

  [
    {
      "Question": "question",
      "Choice": ["Choice", "Choice", "Choice", "Choice"],
      "CorrectChoice":  "correct ans from given choices"
    }
  ]
  and do not give number or alphabeticals to questions and choices like Question 1 2 3 Choice A B C D and correctChoice should be from given choices and duplicate questions
  `;

export const createInstructionsPage = ( testConfig: TestConfigT) =>{
  return ``;
}
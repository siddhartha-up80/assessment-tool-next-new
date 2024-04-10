import Collaborator from "../models/collaborator";
import User from "../models/user";


class CollaboratorService {
 async addCollaborator(emailid: string, ass_id: string, userId: string): Promise<any> {
    const checkUser = await User.findOne({ emailid: emailid });
    if (checkUser && checkUser.type === "recruiter") {
      const addedAssessment = {
        user_id: userId,
        assessment_id: ass_id
      };
      const addedCollaborator = await Collaborator.create({
        user_id: checkUser._id,
        collaborated_assessments: addedAssessment
      });
      return addedCollaborator;
    } else {
      throw new Error("Invalid collaborator");
    }
 }
}

export default CollaboratorService;

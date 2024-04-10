import { error } from "console";
import { GetScoresByAssessmentId } from "../api/databaseFunctions/scoreRepository";
import Assessment from "../models/assessment";
import Score from "../models/score";
import TestConfig from "../models/testConfig";


class AssessmentService {
 async getLeaderboard(ass_id: string): Promise<any> {

    const assessment = await TestConfig.findById(ass_id);
    if (!assessment) {
      throw new Error('Assessment not found');
    }
    const scores = await GetScoresByAssessmentId(ass_id);
    if(!scores.data){
        return scores.error;
    }
    const leaderboard = scores.data.map(score => {
      let leaderboardData = {
        username: score?.user_id?.fullname,
        score: score?.score,
        assessmentName: assessment?.assessmentName,
        emailid: score.user_id?.emailid,
        JdResumeScore: score?.JdResumeScore,
        phone: score?.user_id?.phone,
        behavioural: score?.scoreBehavioral,
      };

      return leaderboardData;
    });

    return leaderboard;
 }
}

export default AssessmentService;

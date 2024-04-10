"use server";
import Score, { ScoreT } from "@/models/score";


async function AddScore(score: Partial<ScoreT>): Promise<{ data: ScoreT | null; error: string | null }> {
    try {
        const newScore = await Score.create(score);
        await newScore.save();
        return { data: newScore, error: null };
    } catch (error:any) {
        return { data: null, error: error.message };
    }
}

async function GetScoreById(id: string): Promise<{ data: ScoreT | null; error: string | null }> {
    try {
        const score = await Score.findById(id);
        if (!score) return { data: null, error: "Not data available" };
        return { data: score, error: null };
    } catch (error:any) {
        return { data: null, error: error.message };
    }
}

async function GetAllScores(): Promise<{ data: ScoreT[] | null; error: string | null }> {
    try {
        const scores = await Score.find();
        if (scores.length === 0) return { data: null, error: "Not data available" };
        return { data: scores, error: null };
    } catch (error:any) {
        return { data: null, error: error.message };
    }
}

async function DeleteScoreById(id: string): Promise<{ data: string | null; error: string | null }> {
    try {
        const score = await Score.findByIdAndDelete(id);
        if (!score) return { data: null, error: "Not data available" };
        return { data: `Score with id ${id} is deleted successfully`, error: null };
    } catch (error:any) {
        return { data: null, error: error.message };
    }
}

async function DeleteScoresByAssId(assid: string): Promise<{ data: string | null; error: string | null }> {
    try {
        const score = await Score.deleteMany({ assessmentid: assid });
        if (!score) return { data: null, error: "Not data available" };
        return { data: `Scores with assessment ids ${assid} are deleted successfully`, error: null };
    } catch (error:any) {
        return { data: null, error: error.message };
    }
}

async function UpdateScoreById(id: string, changes: Partial<ScoreT>): Promise<{ data: ScoreT | null; error: string | null }> {
    try {
        const score = await Score.findByIdAndUpdate(id, changes, { new: true });
        if (!score) return { data: null, error: "Not data available" };
        return { data: score, error: null };
    } catch (error:any) {
        return { data: null, error: error.message };
    }
}

async function GetScoreByAssIdUserId(assid: string, userId: string): Promise<{ data: ScoreT[] | null; error: string | null }> {
    try {
        const score = await Score.find({ assessmentId: assid, userId });
        if (!score) return { data: null, error: "Not data available" };
        return { data: score, error: null };
    } catch (error:any) {
        return { data: null, error: error.message };
    }
}

async function GetScoresByUserId(userid: string): Promise<{ data: ScoreT[] | null; error: string | null }> {
    try {
        const scores = await Score.find({ userid });
        if (scores.length === 0) return { data: null, error: "Not data available" };
        return { data: scores, error: null };
    } catch (error:any) {
        return { data: null, error: error.message };
    }
}

async function GetScoresByAssId(assid: string): Promise<{ data: any[] | null; error: string | null }> {
    try {
        const scores = await Score.find({ assessmentid: assid })
            .sort({ score: -1 }) // -1 for descending order
            .populate('assessmentId')
            .populate('userId')
            .select('userId score functionalscore behavioralscore jdresumescore');
        if (!scores) return { data: null, error: "Not data available" };
        return { data: scores, error: null };
    } catch (error:any) {
        return { data: null, error: error.message };
    }
}

async function GetScoresByAssessmentId(assid: string): Promise<{ data: any[] | null; error: string | null }> {
    try {
        const scores = await Score.aggregate([
            {
               $match: {
                 assessmentId: mongoose.Types.ObjectId(assid),
               },
            },
            {
               $lookup: {
                 from: "testconfigs", 
                 localField: "assessmentId",
                 foreignField: "assessmentId",
                 as: "testConfig",
               },
            },
            {
               $lookup: {
                 from: "testconfigs",
                 localField: "assessmentId",
                 foreignField: "continuationAssessmentId",
                 as: "continuationTestConfig",
               },
            },
            {
               $match: {
                 $expr: {
                   $eq: ["$testUserEmail", "$testConfig.email"],
                 },
               },
            },
            {
               $match: {
                 $expr: {
                   $eq: ["$testUserEmail", "$continuationTestConfig.email"],
                 },
               },
            },
            {
               $sort: {
                 score: -1, // -1 for descending order
               },
            },
           ]);
           
        if (!scores) return { data: null, error: "Not data available" };
        return { data: scores, error: null };
    } catch (error:any) {
        return { data: null, error: error.message };
    }
}
   



export {
    AddScore,
    GetScoreById,
    GetAllScores,
    DeleteScoreById,
    DeleteScoresByAssId,
    UpdateScoreById,
    GetScoreByAssIdUserId,
    GetScoresByUserId,
    GetScoresByAssId,
    GetScoresByAssessmentId
};

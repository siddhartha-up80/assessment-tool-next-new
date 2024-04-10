import dbConnect from "@/app/api/utils/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Score from "../../models/score"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 await dbConnect();

 const {
    query: { id },
    method,
 } = req;

 switch (method) {
    case "POST":
      try {
        const scores = req.body;
        const createdScores = await Score.insertMany(scores);
        res.status(201).json({ success: true, data: createdScores });
      } catch (error:any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "GET":
      try {
        const score = await Score.findById(id);
        if (!score) {
          return res.status(400).json({ success: false, error: "Not data available" });
        }
        res.status(200).json({ success: true, data: score });
      } catch (error:any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "DELETE":
      try {
        const deletedScore = await Score.findByIdAndDelete(id);
        if (!deletedScore) {
          return res.status(400).json({ success: false, error: "Not data available" });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error:any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
 }
}

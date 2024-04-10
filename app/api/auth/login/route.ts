import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/app/api/utils/dbConnect";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  GetUserByEmail,
  isUserT,
} from "../../databaseFunctions/userRepository";
import { UserT } from "@/app/models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "POST") {
    const { emailId, password } = req.body;

    try {
      const user2 = await GetUserByEmail(emailId);
      if (!user2.data || !isUserT(user2.data)) {
        return res
          .status(400)
          .json({ success: false, error: "User not found" });
      }
      const user = user2.data;
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid credentials" });
      }
      const payload = {
        userid: user._id,
        type: user.type,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: process.env.NODE_ENV === "production" ? "2h" : "10h",
      });

      res.status(200).json({ success: true, data: user, token });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { GetOtpByEmail, isOtpT } from "../../databaseFunctions/otpRepository";
import { AddUser } from "../../databaseFunctions/userRepository";
// import { GetOtpByEmail, AddUser } from 'path/to/your/services'; // Adjust the import paths as necessary

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const otp = await GetOtpByEmail(req.body.emailid);
      if (!isOtpT(otp)) {
        return res.status(500).json({ status: 500, message: otp.error });
      }
      if (otp === req.body.otp) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await AddUser({
          ...req.body,
          password: hashedPassword,
          emailid: req.body.emailid.toLowerCase(),
        });
        return res.status(200).json({
          status: 200,
          message: "User created successfully",
          data: newUser,
        });
      } else {
        return res.status(400).json({ status: 400, message: "Invalid Otp" });
      }
    } catch (error: any) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

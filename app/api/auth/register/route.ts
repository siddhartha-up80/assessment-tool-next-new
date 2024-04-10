import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/app/api/utils/dbConnect";
import User, { UserT } from "@/models/user";
import bcrypt from "bcryptjs";
import {
  AddUser,
  GetUserByEmail,
} from "../../databaseFunctions/userRepository";
import {
  AddOtp,
  GetOtpByEmail,
  isOtpT,
} from "../../databaseFunctions/otpRepository";
import { SendOtp } from "../service";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const { emailid } = await request.json();

  try {
    console.log(emailid);
    const { data, error } = await GetUserByEmail(emailid);

    if (data) {
      return new Response(
        JSON.stringify({
          message: `User with emailid ${emailid} is already registered`,
        }),
        { status: 201 }
      );
    }

    if (error) {
      return new Response(
        JSON.stringify({
          message: error,
        }),
        { status: 201 }
      );
    }

    const isotpsendalready = await GetOtpByEmail(emailid);
    if (isotpsendalready.data) {
      return new Response(
        JSON.stringify({
          status: 409,
          message: "otp is already send",
        }),
        { status: 409 }
      );
    }

    if (isotpsendalready.error) {
      return new Response(
        JSON.stringify({
          status: 500,
          message: isotpsendalready.error,
        }),
        { status: 500 }
      );
    }

    let otp: any;

    try {
      otp = await SendOtp(emailid);
      if (!isOtpT(otp)) {
        return new Response(
          JSON.stringify({
            status: 500,
            message: otp.error.message,
          }),
          { status: 500 }
        );
      }
    } catch (error: any) {
      return new Response(
        JSON.stringify({
          status: 500,
          message: error.message,
        }),
        { status: 500 }
      );
    }

    try {
      const newotp = {
        emailId: emailid,
        otp: otp.otp,
      };
      await AddOtp(newotp);

      return new Response(
        JSON.stringify({
          status: 200,
          message: "Otp send successfully",
        }),
        { status: 200 }
      );
    } catch (error: any) {
      return new Response(
        JSON.stringify({
          status: 500,
          message: error.message,
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    return new Response("Failed", { status: 500 });
  }
};

// export async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     const { emailid } = req.body;
//     console.log(req.body);
//     try {
//       const { data, error } = await GetUserByEmail(emailid);
//       if (data) {
//         return res.status(409).json({
//           status: 409,
//           message: `User with emailid ${emailid} is already registered`,
//         });
//       }

//       if (error) {
//         return res.status(500).json({
//           status: 500,
//           message: error,
//         });
//       }

//       const isotpsendalready = await GetOtpByEmail(emailid);
//       if (isotpsendalready.data) {
//         return res.status(409).json({
//           status: 409,
//           message: "otp is already send",
//         });
//       }

//       if (isotpsendalready.error) {
//         return res.status(500).json({
//           status: 500,
//           message: isotpsendalready.error,
//         });
//       }

//       let otp;
//       try {
//         otp = await SendOtp(emailid);
//         if (!isOtpT(otp)) {
//           return res
//             .status(500)
//             .json({ status: 500, message: otp.error.message });
//         }
//       } catch (error: any) {
//         return res.status(500).json({ status: 500, message: error.message });
//       }

//       try {
//         const newotp = {
//           emailId: emailid,
//           otp: otp.otp,
//         };
//         await AddOtp(newotp);
//         return res.status(200).json({
//           status: 200,
//           message: "Otp send successfully",
//         });
//       } catch (error: any) {
//         return res.status(500).json({
//           status: 500,
//           message: error.message,
//         });
//       }
//     } catch (error) {
//       return res.status(500).json({
//         status: 500,
//         message: "Server error",
//       });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

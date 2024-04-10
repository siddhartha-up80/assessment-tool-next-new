import { NextApiRequest, NextApiResponse } from 'next';
import { GetOtpByEmail, UpdateOtpByEmail, isOtpT } from '../../databaseFunctions/otpRepository';
import { GetUserByEmail } from '../../databaseFunctions/userRepository';
import { SendOtp } from '../service';

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 if (req.method === 'POST') {
    const { emailid } = req.body;

    try {
      const { data } = await GetOtpByEmail(emailid);
      const isregistered = await GetUserByEmail(emailid);
      if(isregistered.data) {
        return res.status(409).json({
          status: 409,
          message: "User is already registered",
        });
      }

      if (!data) {
        return res.status(404).json({
          status: 404,
          message: `${emailid} does not exists`,
        });
      } else {
        let otp;
        try {
          otp = await SendOtp(emailid);
          if(!isOtpT(otp)){
            return res.status(500).json({
                status: 500,
                message: otp.error.message,
              });
          }
        } catch (error:any) {
          return res.status(500).json({
            status: 500,
            message: error.message,
          });
        }
        await UpdateOtpByEmail(emailid, { otp: otp.otp });
        return res.status(200).json({
          status: 200,
          message: "Otp resend successfully",
          otp: otp,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Server error",
      });
    }
 } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
 }
}

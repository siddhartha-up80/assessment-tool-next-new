import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { GetUserByEmail, isUserT } from '../../databaseFunctions/userRepository';
import { SendPasswordResetLink } from '../service';

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 if (req.method === 'POST') {
    const { emailid } = req.body;

    try {
      const isuser = await GetUserByEmail(emailid);
      if (!isuser.data || !isUserT(isuser.data)){
        return res.status(404).json({
          status: 404,
          message: `${emailid} does not exist`,
        });
      }

      const token = jwt.sign({ emailid }, process.env.JWT_SECRET!, { expiresIn: '10m' });
      const link = await SendPasswordResetLink(emailid, token);
      return res.status(200).json({
        status: 200,
        message: link,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
 } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
 }
}

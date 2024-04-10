<<<<<<< HEAD
export async function GET(request: Request) {}
 
export async function HEAD(request: Request) {}
 
export async function POST(request: Request) {}
 
export async function PUT(request: Request) {}
 
export async function DELETE(request: Request) {}
 
export async function PATCH(request: Request) {}
 
// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request: Request) {}
=======
// pages/api/openai-response.js
import type { NextApiRequest, NextApiResponse } from 'next';
import {Openairesponse}  from '../../services/AssessmentService'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 try {
    return "hello";
 } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
 }
}
>>>>>>> dev

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const entries = await prisma.guestbook.findMany({
      orderBy: {
        updated_at: 'desc'
      }
    });

    return res.json(
      entries.map((entry: any) => ({
        id: entry.id.toString(),
        body: entry.body,
        created_by: entry.created_by,
        updated_at: entry.updated_at
      }))
    );
  }

  if (req.method === 'POST') {
    const { message, name } = req.body.body
    const newEntry = await prisma.guestbook.create({
      data: {
        email: 'email',
        body: (message || '').slice(0, 500),
        created_by: name
      }
    });

    return res.status(200).json({
      id: newEntry.id.toString(),
      body: newEntry.body,
      created_by: newEntry.created_by,
      updated_at: newEntry.updated_at
    });
  }

  return res.send('Method not allowed.');
}

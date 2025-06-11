import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'test') {
    return res.status(403).end('Forbidden');
  }

  const token = jwt.sign(
    {
      name: 'Test Admin',
      email: 'admin@example.com',
      picture: 'https://example.com/avatar.png',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiry
    },
    process.env.NEXTAUTH_SECRET || 'defaultsecret'
  );

  const cookie = serialize('next-auth.token', token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // set to true in production with HTTPS
  });

  res.setHeader('Set-Cookie', cookie);
  res.status(200).end();
}

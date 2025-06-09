import dbConnect from '../../lib/db';
import Identifier from '../../models/Identifier';
import { createToken } from '../../lib/tokenStore';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();
  const { value, source } = req.body;
  let record = await Identifier.findOne({ value });

  if (record) {
    record.activities.push({ type: 'used', source });
    await record.save();
  } else {
    record = await Identifier.create({
      value,
      activities: [{ type: 'created', source }]
    });
  }

  const token = createToken(value);
  res.json({ token, message: 'Token issued' });
}

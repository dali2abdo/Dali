import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { type } = req.query;

  if (!type || !['Bot', 'Questions'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type. Use Bot or Questions' });
  }

  const filePath = path.join(process.cwd(), 'data', `${type}.json`);

  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    const responses = JSON.parse(fileData);

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return res.status(200).json({ response: randomResponse });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to read or parse file' });
  }
}

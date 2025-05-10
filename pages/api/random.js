import fs from 'fs';
import path from 'path';

const used = {
  Bot: new Set(),
  Questions: new Set(),
};

function loadResponses(category) {
  const filePath = path.join(process.cwd(), 'data', `${category}.json`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function getRandom(category) {
  const all = loadResponses(category);
  const unused = all.filter((_, i) => !used[category].has(i));

  if (unused.length === 0) {
    used[category].clear();
    return getRandom(category);
  }

  const index = Math.floor(Math.random() * unused.length);
  const realIndex = all.indexOf(unused[index]);
  used[category].add(realIndex);

  return unused[index];
}

export default function handler(req, res) {
  const { category } = req.query;

  if (!category || !['Bot', 'Questions'].includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  try {
    const response = getRandom(category);
    return res.status(200).json({ response });
  } catch (e) {
    return res.status(500).json({ error: 'Error reading responses' });
  }
}

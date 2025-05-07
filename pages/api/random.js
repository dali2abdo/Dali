import fs from 'fs';
import path from 'path';

let used = {};

function pickRandom(type, list) {
  if (!used[type]) used[type] = new Set();
  if (used[type].size >= list.length) used[type].clear();

  const remaining = list.filter(item => !used[type].has(item));
  const chosen = remaining[Math.floor(Math.random() * remaining.length)];
  used[type].add(chosen);
  return chosen;
}

export default function handler(req, res) {
  const { type = 'Bot' } = req.query;
  const filePath = path.join(process.cwd(), 'data', `${type}.json`);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const list = JSON.parse(content);

    if (!Array.isArray(list) || list.length === 0) {
      return res.status(400).send("الملف فارغ أو غير صالح.");
    }

    const result = pickRandom(type, list);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send(result);
  } catch (err) {
    console.error("خطأ:", err);
    res.status(404).send("نوع الرد غير موجود.");
  }
}

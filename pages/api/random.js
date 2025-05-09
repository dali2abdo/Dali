import fs from 'fs';
import path from 'path';

const cache = {
  Bot: [],
  Questions: [],
};

function getRandomItem(category, data) {
  // تصفية العناصر غير المستخدمة
  const unused = data.filter((item) => !cache[category].includes(item));

  // لو خلصت العناصر: نبدأ من جديد
  if (unused.length === 0) {
    cache[category] = [];
    return getRandomItem(category, data);
  }

  // اختيار عنصر عشوائي
  const random = unused[Math.floor(Math.random() * unused.length)];
  cache[category].push(random);
  return random;
}

export default function handler(req, res) {
  const { category } = req.query;

  if (!category || (category !== 'Bot' && category !== 'Questions')) {
    return res.status(400).json({ error: 'Invalid or missing category' });
  }

  const filePath = path.join(process.cwd(), 'data', `${category}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const response = getRandomItem(category, data);
  return res.status(200).json({ response });
}

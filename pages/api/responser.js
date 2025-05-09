import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.join(process.cwd(), 'db', 'responses.db');
const db = new Database(dbPath);

// دالة لجلب رد عشوائي غير مستخدم
function getRandomResponse(category) {
  const unused = db.prepare(
    'SELECT * FROM responses WHERE category = ? AND used = 0 ORDER BY RANDOM() LIMIT 1'
  ).get(category);

  // لو ما فيه ردود غير مستخدمة: إعادة ضبط الكل
  if (!unused) {
    db.prepare('UPDATE responses SET used = 0 WHERE category = ?').run(category);
    return getRandomResponse(category);
  }

  // تعليم الرد كمستخدم
  db.prepare('UPDATE responses SET used = 1 WHERE id = ?').run(unused.id);

  return unused.text;
}

export default function handler(req, res) {
  const { category } = req.query;

  if (!category || (category !== 'Bot' && category !== 'Questions')) {
    return res.status(400).json({ error: 'Invalid or missing category' });
  }

  try {
    const response = getRandomResponse(category);
    return res.status(200).json({ response });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

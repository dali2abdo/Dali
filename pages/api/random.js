import path from 'path';
import Database from 'better-sqlite3';

// افتح القاعدة في وضع القراءة فقط
const dbPath = path.join(process.cwd(), 'db', 'responses.db');
const db = new Database(dbPath, { readonly: true });

export default function handler(req, res) {
  const { type = 'Bot' } = req.query;

  try {
    // نجيب كل الردود من الفئة المطلوبة
    const rows = db.prepare(`
      SELECT text FROM responses
      WHERE category = ?
    `).all(type);

    if (rows.length === 0) {
      return res.status(404).send('نوع الرد غير موجود.');
    }

    // اختيار عشوائي من دون تتبع used
    const pick = rows[Math.floor(Math.random() * rows.length)].text;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(pick);

  } catch (err) {
    console.error(err);
    res.status(500).send('حدث خطأ في السيرفر.');
  }
}

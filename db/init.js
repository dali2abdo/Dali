import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.join(process.cwd(), 'db', 'responses.db');
const db = new Database(dbPath);

// إعادة بناء الجدول مع عمود used
db.exec(`
  DROP TABLE IF EXISTS responses;
  CREATE TABLE responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    text TEXT NOT NULL,
    used INTEGER DEFAULT 0
  );
`);

const insert = db.prepare('INSERT INTO responses (category, text, used) VALUES (?, ?, 0)');

const botData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'Bot.json')));
const questionsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'Questions.json')));

botData.forEach((text) => {
  insert.run('Bot', text);
});

questionsData.forEach((text) => {
  insert.run('Questions', text);
});

console.log('تم إنشاء قاعدة البيانات مع نظام منع التكرار.');

let usedResponses = [];

export default function handler(req, res) {
  const { type } = req.query;

  if (!type || !['Bot', 'Questions'].includes(type)) {
    return res.status(400).send('Invalid type. Use Bot or Questions');
  }

  const filePath = path.join(process.cwd(), 'data', `${type}.json`);

  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    const responses = JSON.parse(fileData);

    const availableResponses = responses.filter(r => !usedResponses.includes(r));

    if (availableResponses.length === 0) {
      usedResponses = []; // reset
      return res.status(200).send('تم عرض جميع الردود. أعد المحاولة لاحقًا.');
    }

    const randomResponse = availableResponses[Math.floor(Math.random() * availableResponses.length)];
    usedResponses.push(randomResponse);

    return res.status(200).send(randomResponse);
  } catch (err) {
    return res.status(500).send('Failed to read or parse file');
  }
}

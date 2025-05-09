import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const { category } = req.query;

  if (!category || (category !== 'Bot' && category !== 'Questions')) {
    return res.status(400).json({ error: 'Invalid or missing category' });
  }

  // جلب رد غير مستخدم
  const { data, error } = await supabase
    .from('responses')
    .select('*')
    .eq('category', category)
    .eq('used', false)
    .order('random()')
    .limit(1);

  if (error) return res.status(500).json({ error: error.message });

  const response = data?.[0];

  if (!response) {
    // إعادة تعيين الردود
    await supabase
      .from('responses')
      .update({ used: false })
      .eq('category', category);
    return handler(req, res); // إعادة المحاولة
  }

  // تعليم الرد كمستخدم
  await supabase
    .from('responses')
    .update({ used: true })
    .eq('id', response.id);

  return res.status(200).json({ response: response.text });
}

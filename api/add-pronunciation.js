import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'pronunciations.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { word, phoneme } = req.body;
  if (!word || !phoneme) return res.status(400).json({ message: 'Missing word or phoneme' });

  let rules = [];
  try {
    const file = fs.readFileSync(filePath, 'utf-8');
    rules = JSON.parse(file);
  } catch {
    rules = [];
  }

  rules.push({ word, phoneme, alphabet: 'ipa' });

  fs.writeFileSync(filePath, JSON.stringify(rules, null, 2));
  res.status(200).json({ message: 'Saved' });
}

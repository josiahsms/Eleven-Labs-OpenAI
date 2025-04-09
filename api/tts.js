export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'POST');  // Allow only POST requests
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Allow Content-Type header

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const elevenResText = await elevenRes.text();
    console.log(elevenResText);

    if (!elevenRes.ok) {
      throw new Error(`ElevenLabs API failed: ${elevenResText}`);
    }

    const audioBuffer = await elevenRes.buffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
  } catch (err) {
    console.error('API request failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

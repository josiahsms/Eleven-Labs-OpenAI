export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    console.log('Request body:', { text });  // Log the text received

    const elevenRes = await fetch('https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    console.log('ElevenLabs response:', elevenRes);  // Log the response

    if (!elevenRes.ok) {
      const errorText = await elevenRes.text();
      throw new Error(`ElevenLabs API failed: ${errorText}`);
    }

    const audioBuffer = await elevenRes.buffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
  } catch (err) {
    console.error('API request failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

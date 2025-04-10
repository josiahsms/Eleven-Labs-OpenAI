export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text } = req.body;
  const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;
  const VOICE_ID = '9BWtsMINqrJLrRacOk9x';

  if (!text || !ELEVEN_API_KEY) {
    return res.status(400).json({ message: 'Missing text or API key' });
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVEN_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_flash_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs error:', errorText);
      return res.status(500).json({ message: 'Failed to fetch audio', error: errorText });
    }

    if (response.headers.get('Content-Type') === 'application/json') {
      const errorJson = await response.json();
      console.error('ElevenLabs API JSON Error:', errorJson);
      return res.status(500).json({ message: 'ElevenLabs API Error', error: JSON.stringify(errorJson) });
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);

  } catch (err) {
    console.error('API route error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}

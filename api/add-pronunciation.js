import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCs-ILSMK89OWcWCmoBvImEQXC-6PK11iw",
  authDomain: "elevenlabs-agent.firebaseapp.com",
  projectId: "elevenlabs-agent",
  storageBucket: "elevenlabs-agent.firebasestorage.app",
  messagingSenderId: "454181412358",
  appId: "1:454181412358:web:1cdae2e5398a0407d12d87",
  measurementId: "G-5MPZVTJWTL"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized
}

const db = firebase.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { word, phoneme, alphabet } = req.body;

  if (!word || !phoneme || !alphabet) {
    return res.status(400).json({ message: 'Missing word, phoneme, or alphabet' });
  }

  try {
    // Store pronunciation in Firestore
    await db.collection('pronunciations').add({
      word,
      phoneme,
      alphabet,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ message: 'Pronunciation added successfully' });
  } catch (err) {
    console.error('Error adding pronunciation:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}

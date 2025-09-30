// config/db.js
const mongoose = require("mongoose");

// Simple retry + fallback logic to make local dev smoother
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 1500;

function redactConnectionString(uri) {
  if (!uri) return 'undefined';
  // Remove credentials if present: mongodb://user:pass@host/db
  return uri.replace(/:\\w+@/, ':***@');
}

async function attemptConnect(uri, attempt = 1) {
  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected successfully (attempt ${attempt})`);
    return true;
  } catch (err) {
    console.error(`MongoDB connection error (attempt ${attempt}):`, err.message);
    if (attempt < MAX_RETRIES) {
      await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      return attemptConnect(uri, attempt + 1);
    }
    return false;
  }
}

const connectDB = async () => {
  let primaryUri = process.env.MONGO_URI;
  const fallbackUri = 'mongodb://127.0.0.1:27017/taskmanager';

  if (!primaryUri || primaryUri.trim() === '') {
    console.warn('[DB] MONGO_URI not set. Using fallback local URI.');
    primaryUri = fallbackUri;
  }

  console.log('[DB] Trying Mongo connection to', redactConnectionString(primaryUri));
  const ok = await attemptConnect(primaryUri);
  if (!ok && primaryUri !== fallbackUri) {
    console.log('[DB] Trying fallback URI', fallbackUri);
    const fallbackOk = await attemptConnect(fallbackUri);
    if (!fallbackOk) {
      console.error('[DB] All connection attempts failed. Exiting.');
      process.exit(1);
    }
  } else if (!ok) {
    console.error('[DB] Connection failed after retries. Exiting.');
    process.exit(1);
  }
};

module.exports = connectDB;

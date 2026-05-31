import mongoose from 'mongoose';
import fs from 'fs';

const env = {};
const envFile = fs.readFileSync('/Users/yasirkhan/Documents/GitHub/HakaiMotives/.env', 'utf8');
envFile.split('\n').forEach((line) => {
  const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[key] = val;
  }
});

const DB_URI = env.DATABASE_URI;

async function main() {
  await mongoose.connect(DB_URI);
  const db = mongoose.connection.db;

  console.log("Searching 'media' collection for logo files...");
  const mediaCollection = db.collection('media');
  const mediaItems = await mediaCollection.find({ filename: /logo/i }).toArray();
  
  for (const item of mediaItems) {
    console.log('Media Item:', item);
  }

  await mongoose.disconnect();
}

main().catch(console.error);

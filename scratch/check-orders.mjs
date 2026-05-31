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

  console.log('\n--- LAST 5 ORDERS ---');
  const orders = await db.collection('orders').find().sort({ createdAt: -1 }).limit(5).toArray();
  
  if (orders.length === 0) {
    console.log("No orders found in the database.");
  }

  for (const order of orders) {
    console.log(`Order ID: ${order._id}`);
    console.log(`  Customer: ${order.customerName} (${order.customerEmail})`);
    console.log(`  Phone: ${order.customerPhone}`);
    console.log(`  Address: ${order.customerAddress}`);
    console.log(`  Total: PKR ${order.total}`);
    console.log(`  Status: ${order.status}`);
    console.log(`  Payment: ${order.paymentMethod}`);
    console.log(`  Created At: ${order.createdAt}`);
    console.log('------------------------------------');
  }

  await mongoose.disconnect();
}

main().catch(console.error);

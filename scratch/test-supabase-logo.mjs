import http from 'https';

const urls = [
  'https://ekgrepccvtqpcqqxwbft.supabase.co/storage/v1/object/public/HakaiMotives/logo.png',
  'https://ekgrepccvtqpcqqxwbft.supabase.co/storage/v1/object/public/hakaimotives/logo.png',
  'https://ekgrepccvtqpcqqxwbft.supabase.co/storage/v1/object/public/HakaiMotives/media/logo.png',
  'https://ekgrepccvtqpcqqxwbft.supabase.co/storage/v1/object/public/hakaimotives/media/logo.png',
  'https://ekgrepccvtqpcqqxwbft.supabase.co/storage/v1/object/public/HakaiMotives/file/logo.png',
  'https://ekgrepccvtqpcqqxwbft.supabase.co/storage/v1/object/public/hakaimotives/file/logo.png',
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ url, statusCode: res.statusCode, body });
      });
    }).on('error', (err) => {
      resolve({ url, statusCode: 500, body: err.message });
    });
  });
}

async function main() {
  for (const url of urls) {
    const res = await checkUrl(url);
    console.log(`URL: ${url}`);
    console.log(`  Status: ${res.statusCode}`);
    if (res.statusCode !== 200) {
      console.log(`  Body: ${res.body.slice(0, 100)}`);
    }
    console.log('--------------------------------');
  }
}

main();

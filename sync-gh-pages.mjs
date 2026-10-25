import fs from 'fs';
import path from 'path';

const distAssetsDir = path.resolve('dist/assets');
const publicGhDir = path.resolve('public/gh-pages');

fs.mkdirSync(publicGhDir, { recursive: true });

if (fs.existsSync(distAssetsDir)) {
  const files = fs.readdirSync(distAssetsDir);
  for (const file of files) {
    if (file.endsWith('.js')) {
      fs.copyFileSync(path.join(distAssetsDir, file), path.join(publicGhDir, 'app.js'));
    } else if (file.endsWith('.css')) {
      fs.copyFileSync(path.join(distAssetsDir, file), path.join(publicGhDir, 'app.css'));
    }
  }
}

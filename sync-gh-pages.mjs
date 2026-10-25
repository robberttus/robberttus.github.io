import fs from 'fs';
import path from 'path';

const distAssetsDir = path.resolve('dist/assets');
const ghPagesDir = path.resolve('gh-pages');
const publicImagesDir = path.resolve('public/images');
const rootImagesDir = path.resolve('images');

fs.mkdirSync(ghPagesDir, { recursive: true });
fs.mkdirSync(rootImagesDir, { recursive: true });

if (fs.existsSync(distAssetsDir)) {
  const files = fs.readdirSync(distAssetsDir);
  for (const file of files) {
    if (file.endsWith('.js')) {
      fs.copyFileSync(path.join(distAssetsDir, file), path.join(ghPagesDir, 'app.js'));
    } else if (file.endsWith('.css')) {
      fs.copyFileSync(path.join(distAssetsDir, file), path.join(ghPagesDir, 'app.css'));
    }
  }
}

if (fs.existsSync(publicImagesDir)) {
  const imgFiles = fs.readdirSync(publicImagesDir);
  for (const img of imgFiles) {
    fs.copyFileSync(path.join(publicImagesDir, img), path.join(rootImagesDir, img));
  }
}

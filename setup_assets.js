const fs = require('fs');
const path = require('path');

const assets = [
  {
    src: 'C:/Users/acer/.gemini/antigravity/brain/29fe8a9a-529e-416c-bcf7-b3569c09a563/.user_uploaded/media__1784198633605.jpg',
    dest: 'd:/Projects/assets/profile.jpg'
  },
  {
    src: 'C:/Users/acer/.gemini/antigravity/brain/29fe8a9a-529e-416c-bcf7-b3569c09a563/farming_robot_1784197231361.jpg',
    dest: 'd:/Projects/assets/farming_robot.jpg'
  }
];

const destDir = 'd:/Projects/assets';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

assets.forEach(asset => {
  try {
    if (fs.existsSync(asset.src)) {
      fs.copyFileSync(asset.src, asset.dest);
      console.log(`Copied: ${path.basename(asset.src)} -> ${asset.dest}`);
    } else {
      console.error(`Source not found: ${asset.src}`);
    }
  } catch (err) {
    console.error(`Error copying ${path.basename(asset.src)}:`, err.message);
  }
});
console.log('Setup complete!');

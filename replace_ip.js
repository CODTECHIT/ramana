const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      replaceInDir(fullPath);
    } else if (stat.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('127.0.0.1:5000')) {
        const newContent = content.replace(/127\.0\.0\.1:5000/g, 'localhost:5000');
        fs.writeFileSync(fullPath, newContent);
        console.log('Replaced in:', fullPath);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'src'));
console.log('Done replacing.');

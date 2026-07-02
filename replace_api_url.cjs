const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walk(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

let modifiedCount = 0;

walk(srcDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace: const API = "http://localhost:5000";
    content = content.replace(/const API = ["']http:\/\/localhost:5000["'];/g, 'const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";');

    // Replace double quote strings: "http://localhost:5000/api/..." -> `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/...`
    content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}$1`');
    
    // Replace single quote strings: 'http://localhost:5000/api/...'
    content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}$1`');

    // Replace backtick strings: `http://localhost:5000/api/...`
    content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}$1`');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
      modifiedCount++;
    }
  }
});

console.log(`Updated ${modifiedCount} files.`);

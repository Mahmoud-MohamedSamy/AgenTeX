const fs = require('fs'); let s = fs.readFileSync('make-report.js', 'utf8');
if (!s.includes('zoho-section')) { s = s.replace('<h2>Not covered</h2>', "${fs.existsSync(path.join(RUN, 'out/zoho-section.html')) ? fs.readFileSync(path.join(RUN, 'out/zoho-section.html'), 'utf8') : ''}\n<h2>Not covered</h2>"); fs.writeFileSync('make-report.js', s); }
console.log(s.includes('zoho-section'));

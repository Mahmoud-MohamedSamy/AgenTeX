const fs = require('fs');
const code = '(async (page,ctx,h)=>{\n' + fs.readFileSync(__dirname + '/zlib.js', 'utf8') + '\n' + fs.readFileSync(__dirname + '/zdlib.js', 'utf8') + '\nreturn await (' + fs.readFileSync(process.argv[2], 'utf8') + ')(page,ctx,h);})';
fetch('http://127.0.0.1:8887/run', { method: 'POST', body: JSON.stringify({ code }) }).then(r => r.text()).then(t => console.log(t.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g, '<email>').slice(0, 15000))).catch(e => console.log('ERR', e.message));

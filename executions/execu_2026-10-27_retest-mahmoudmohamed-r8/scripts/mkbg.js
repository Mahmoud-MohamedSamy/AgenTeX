const fs = require('fs'); fs.writeFileSync('bgrep.js', fs.readFileSync('bgrep.tpl', 'utf8').replace('__PAT__', JSON.stringify(process.argv[2])).replace('__W__', process.argv[3] || '60'));

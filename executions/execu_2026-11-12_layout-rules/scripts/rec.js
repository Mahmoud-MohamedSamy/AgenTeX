// node rec.js <app> <id> <verdict> <fact...> — append a result line
const fs=require('fs');const [app,id,v,...f]=process.argv.slice(2);
fs.appendFileSync(__dirname+'/../results.tsv',[app,id,v,f.join(' ').replace(/\s+/g,' ')].join('\t')+'\n');console.log(app,id,v);

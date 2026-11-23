// node rec.js ID VERDICT "note"  -> appends to out/results.jsonl
const fs=require('fs');const [id,v,...n]=process.argv.slice(2);fs.appendFileSync(__dirname+'/../out/results.jsonl',JSON.stringify({id,verdict:v,note:n.join(' '),at:new Date().toISOString().slice(0,19)})+'\n');

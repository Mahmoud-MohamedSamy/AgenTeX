// node res.js <id> <verdict> <note>
const fs=require('fs');fs.appendFileSync(__dirname+'/../out/results.jsonl',JSON.stringify({id:process.argv[2],verdict:process.argv[3],note:process.argv[4],at:new Date().toISOString().slice(0,19)})+'\n');console.log('ok',process.argv[2],process.argv[3]);

// node scripts/set.js <tc> <pass|fail|blocked|notbuilt> "<note>" [bug]
const fs=require('fs');const R=JSON.parse(fs.readFileSync('results.json'));const [tc,s,note,bug]=process.argv.slice(2);
const old=R[tc];R[tc]={s,src:'run',at:new Date().toISOString().slice(0,10),note,bug:bug||'',run:'2026-11-11_manual-sheet-run',hist:old?[...(old.hist||[]),old.at+' '+old.s+' ('+(old.src==='auto'?'earlier run':'sheet run')+')']:[]};
fs.writeFileSync('results.json',JSON.stringify(R,null,1));console.log(tc,s);

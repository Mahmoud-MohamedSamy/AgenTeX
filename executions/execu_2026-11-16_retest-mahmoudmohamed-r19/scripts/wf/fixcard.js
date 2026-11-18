const fs=require('fs');const f='cards/2962-api-card.json';const j=JSON.parse(fs.readFileSync(f,'utf8'));
const BS=String.fromCharCode(92);
const fix=s=>s.split('\r').join(BS+'r').split('\n').join(BS+'n').split('\u0000').join(BS+'0');
j.rows=j.rows.map(r=>r.map(x=>typeof x==='string'?fix(x):x));fs.writeFileSync(f,JSON.stringify(j));console.log(j.rows[0][1],'|',j.rows[4][1]);

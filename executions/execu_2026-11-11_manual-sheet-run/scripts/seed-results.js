// Seed results.json from the automation mapping of 11 Nov (runs 4-11 Nov).
const fs=require('fs');const M=JSON.parse(fs.readFileSync('automation-merged.json')).res;const g5=JSON.parse(fs.readFileSync(process.argv[2])).mapped.find(x=>x.tc==='C-05-07');
M['C-05-07']={...g5,cov:'full',hist:['2026-11-10 FAIL (gap-list recheck that filed NDC-2830, before the fix)']};
const R={};const map={PASS:'pass',FAIL:'fail',PARTIAL:'fail',BLOCKED:'blocked'};
for(const [tc,r] of Object.entries(M)){R[tc]={s:map[r.result],cov:r.cov,src:'auto',at:r.date,bug:r.bug||'',note:(r.result==='PARTIAL'?'Partly fixed. ':'')+(r.cov==='partial'?'Partly covered: ':'')+r.evidence,run:String(r.run||'').replace('execu_',''),hist:r.hist||[]};}
fs.writeFileSync('results.json',JSON.stringify(R,null,1));console.log(Object.keys(R).length);

// Writes one spec per bug with screenshots and runs annotate.js (TAVI evidence; Zoho column = expected, Zoho not captured yet).
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');const D=path.join(__dirname,'..');
const bugs=require('./bugs');const only=process.argv[2];
for(const b of bugs){if(!b.panels)continue;if(only&&b.id!==only)continue;
 const spec={out:b.id+'-'+b.cases.split(/[ ,]/)[0]+'-FAIL.png',ticket:b.id+' · '+b.cases,title:b.title,verdict:'FAIL',label:'BUG (draft)',date:'11 Nov 2026',env:'staging-desk.taviportal.com · tenant NDC-Staging · Edge',
  panels:b.panels,rows:b.rows,leftHead:'TAVI Desk (screenshot above)',rightHead:'Expected (test sheet) — Zoho Desk not captured yet',rightLabel:'Expected'};
 const sp=path.join(D,'evidence/specs',b.id+'.json');fs.writeFileSync(sp,JSON.stringify(spec,null,1));
 execFileSync('node',[path.join(__dirname,'annotate.js'),sp],{stdio:'inherit'});}

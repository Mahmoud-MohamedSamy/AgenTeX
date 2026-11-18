const fs=require('fs'); const rows=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/).map(l=>l.split(','));
const ki=rows[0].findIndex(h=>/secret key/i.test(h)); const H={'X-API-Key':rows[1][ki>=0?ki:rows[0].length-1].replace(/"/g,'').trim()};
const B='https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const S={'11f2d31f-9d01-4463-a1de-ce99521b97aa':'Done','34a7f4b6-7207-4955-b927-0d8d1dd3c666':'Bug','f5299bf6-0dfc-4d40-9223-da9c1fab09b1':'RFT'};
const only=process.argv[2]?process.argv[2].split(','):null;
(async()=>{const d=require('../plane-draft.json').filter(x=>x.stateId&&(!only||only.includes(x.ticket)));const out=[];let bad=0;
for(const x of d){const g=async u=>{for(let i=0;i<4;i++){const r=await fetch(B+u,{headers:H});if(r.status===429){await new Promise(z=>setTimeout(z,8000));continue;}return r.json();}};
const w=await g(`/work-items/${x.id}/`);const a=await g(`/work-items/${x.id}/attachments/`);const c=await g(`/work-items/${x.id}/comments/?per_page=100`);
const names=(Array.isArray(a)?a:a.results||[]).map(f=>(f.attributes&&f.attributes.name)||f.name||'');const at=x.images.filter(i=>names.includes(i)).length;
const cm=(Array.isArray(c)?c:c.results||[]).some(k=>/Retest \w+ — 17 Nov 2026/.test(k.comment_html||''));
const ok=S[w.state]===x.state&&at===x.images.length&&cm;if(!ok)bad++;out.push(`${x.ticket} ${S[w.state]||w.state} img ${at}/${x.images.length} comment ${cm?'yes':'NO'}${ok?'':'  <<'}`);await new Promise(z=>setTimeout(z,700));}
console.log(out.join('\n'));console.log('checked',d.length,'problems',bad);})();

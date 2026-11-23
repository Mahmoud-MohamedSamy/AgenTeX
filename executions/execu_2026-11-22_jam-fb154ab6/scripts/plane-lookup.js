const fs=require('fs');const dir='C:/Users/Dell/Downloads';const f=fs.readdirSync(dir).filter(x=>/^secret-key-.*\.csv$/.test(x)).sort().pop();
const rows=fs.readFileSync(dir+'/'+f,'utf8').trim().split(/\r?\n/);const cells=rows[1].split(',');const KEY=cells[3].replace(/"/g,'').trim();
const P='https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';const H={'X-API-Key':KEY};
(async()=>{const g=async u=>{const r=await fetch(u,{headers:H});return r.json();};const L=x=>x.results||x;
const m=L(await g('https://api.plane.so/api/v1/workspaces/ahmed-hegazy/members/'));console.log('members',JSON.stringify(m.map(x=>[x.id,x.display_name,(x.first_name||'')+' '+(x.last_name||'')])));
const s=L(await g(P+'/states/'));console.log('states',JSON.stringify(s.map(x=>[x.id,x.name])));
const c=L(await g(P+'/cycles/?per_page=100'));console.log('cycles',JSON.stringify(c.filter(x=>/17|16|18/.test(x.name)).map(x=>[x.id,x.name,x.status||'',x.end_date])));
const mo=L(await g(P+'/modules/'));console.log('modules',JSON.stringify(mo.map(x=>[x.id,x.name])));
console.log('keyfile',f,'expiry',cells[2]);})();

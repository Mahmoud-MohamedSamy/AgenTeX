const fs=require('fs');const dir='C:/Users/Dell/Downloads';const kf=fs.readdirSync(dir).filter(x=>/^secret-key-.*\.csv$/.test(x)).sort().pop();const KEY=fs.readFileSync(dir+'/'+kf,'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g,'').trim();
const P='https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';const H={'X-API-Key':KEY};const id='121adfcd-630b-4f39-8bc1-cd6f2b4504f4';
(async()=>{const g=async u=>(await fetch(u,{headers:H})).json();const w=await g(P+'/work-items/'+id+'/');const a=await g(P+'/work-items/'+id+'/attachments/');const l=await g(P+'/work-items/'+id+'/links/');
const c=await g(P+'/cycles/8347595f-5728-4093-bb08-f451e7faa47b/cycle-issues/?per_page=200');const m=await g(P+'/modules/dea98455-e533-4b49-8a48-6fb88f3249a3/module-issues/?per_page=500');
const has=x=>JSON.stringify(x).includes(id);
console.log(JSON.stringify({seq:w.sequence_id,name:w.name,priority:w.priority,state:w.state,assignees:w.assignees,att:(a.results||a).map(x=>[x.attributes&&x.attributes.name,x.is_uploaded]),links:(l.results||l).length,inCycle:has(c),inModule:has(m)}));})();

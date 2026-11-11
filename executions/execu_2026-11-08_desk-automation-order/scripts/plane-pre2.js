const fs=require('fs'),path=require('path');const DL='C:/Users/Dell/Downloads';const f=fs.readdirSync(DL).filter(n=>/^secret-key-\d+\.csv$/.test(n)).sort().pop();const KEY=(fs.readFileSync(path.join(DL,f),'utf8').match(/plane_[A-Za-z0-9_-]+/)||[])[0];
const BASE='https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const call=async p=>{const r=await fetch(BASE+p,{headers:{'x-api-key':KEY}});return r.json();};
(async()=>{const L=await call('/labels/?per_page=100');0&&console.log((L.results||L).map(x=>x.name+'='+x.id).filter(x=>/assign|mail|email|channel|automation|round/i.test(x)).join('\n'));
let items=[];let cur=null;for(let i=0;i<10;i++){const r=await call('/work-items/?per_page=100&order_by=-created_at'+(cur?'&cursor='+cur:''));items.push(...(r.results||[]));if(!r.next_page_results)break;cur=r.next_cursor;}
console.log('recent',items.length);console.log(items.filter(x=>/escalat|bulk|closed mail|close.*notif|remove.*agent|delet.*agent|whom to|no access|SLA.*mail|recipient/i.test(x.name)).map(x=>'NDC-'+x.sequence_id+' '+x.created_at.slice(0,16)+' '+x.name).join('\n'));})();

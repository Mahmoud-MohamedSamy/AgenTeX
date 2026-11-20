const fs=require('fs');const rows=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/).map(l=>l.split(','));
const ki=rows[0].findIndex(h=>/secret key/i.test(h));const KEY=rows[1][ki>=0?ki:rows[0].length-1].replace(/"/g,'').trim();
const W='https://api.plane.so/api/v1/workspaces/ahmed-hegazy';const B=W+'/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const g=async u=>{for(let i=0;i<4;i++){try{return await (await fetch(u,{headers:{'x-api-key':KEY}})).json()}catch(e){await new Promise(r=>setTimeout(r,3000))}}};
const M={'e1364b0b':'MahmoudMohamed','82cf7a79':'mfathy','9529016b':'eahmed','9c2ff309':'Hegazy'};
(async()=>{for(const n of process.argv.slice(2)){const w=await g(W+'/work-items/NDC-'+n+'/');const a=await g(B+'/work-items/'+w.id+'/activities/?per_page=100');const c=await g(B+'/work-items/'+w.id+'/comments/');
const L=(a.results||a||[]).filter(x=>x.field==='state').slice(-3).map(x=>`${x.created_at?.slice(5,16)} ${x.old_value}→${x.new_value} by ${M[(x.actor||'').slice(0,8)]||(x.actor||'').slice(0,8)}`);
const lc=(c.results||[]).slice(-1)[0];console.log('NDC-'+n,'|',L.join(' ; '),'| comments',(c.results||[]).length,'| last comment',lc?lc.created_at.slice(0,10)+' '+(lc.comment_html||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,140):'-');}})();

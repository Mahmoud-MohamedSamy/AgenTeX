const fs=require('fs');const rows=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/).map(l=>l.split(','));
const ki=rows[0].findIndex(h=>/secret key/i.test(h));const KEY=rows[1][ki>=0?ki:rows[0].length-1].replace(/"/g,'').trim();
const W='https://api.plane.so/api/v1/workspaces/ahmed-hegazy';const B=W+'/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const g=async u=>{for(let i=0;i<4;i++){try{return await (await fetch(u,{headers:{'x-api-key':KEY}})).json()}catch(e){await new Promise(r=>setTimeout(r,3000))}}};
(async()=>{for(const n of process.argv.slice(2)){const w=await g(W+'/work-items/NDC-'+n+'/?expand=state');const c=await g(B+'/work-items/'+w.id+'/comments/');const a=await g(B+'/work-items/'+w.id+'/attachments/');
const today=(c.results||[]).filter(x=>/Retest PASS — 19 Nov 2026/.test(x.comment_html));
console.log('NDC-'+n,w.state.name,'| comments today',today.length,'| attachments',(a.results||a).map(x=>x.attributes?.name).filter(f=>/retest|SN-/.test(f)).join(', '));}})();

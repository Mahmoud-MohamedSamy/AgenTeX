// Downloads the public JS bundles (no session) of a host into bundles/<tag>.js
const fs=require('fs');const [host,tag]=process.argv.slice(2);const D=__dirname+'/../bundles/';fs.mkdirSync(D,{recursive:true});
const get=async u=>{const c=new AbortController();const t=setTimeout(()=>c.abort(),20000);try{const r=await fetch(u,{signal:c.signal});return r.ok?await r.text():''}catch(e){return ''}finally{clearTimeout(t)}};
(async()=>{const seen=new Set();let q=[];const html=await get(host+'/');
for(const m of html.matchAll(/(?:src|href)="([^"]+\.js)"/g)) q.push(new URL(m[1],host).href);
let n=0;const out=fs.createWriteStream(D+tag+'.js');
while(q.length&&n<1500){const batch=[...new Set(q.splice(0,12))].filter(u=>!seen.has(u));batch.forEach(u=>seen.add(u));
 const res=await Promise.all(batch.map(get));
 res.forEach((t,i)=>{if(!t)return;n++;out.write('\n/*FILE '+batch[i]+'*/\n'+t);
  for(const m of t.matchAll(/["'`](\.{0,2}\/?(?:assets\/)?[A-Za-z0-9_.\-\/]+\.js)["'`]/g)){try{const v=new URL(m[1],batch[i]).href;if(v.startsWith(host)&&!seen.has(v))q.push(v)}catch(e){}}});}
out.end();console.log(tag,'files',n,'seen',seen.size);})();

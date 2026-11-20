const fs=require('fs');const rows=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/).map(l=>l.split(','));
const ki=rows[0].findIndex(h=>/secret key/i.test(h));const KEY=rows[1][ki>=0?ki:rows[0].length-1].replace(/"/g,'').trim();
const W='https://api.plane.so/api/v1/workspaces/ahmed-hegazy';const g=async u=>{for(let i=0;i<4;i++){try{return await (await fetch(u,{headers:{'x-api-key':KEY}})).json()}catch(e){await new Promise(r=>setTimeout(r,3000))}}};
const ns=[3106,3101,3103,3087,2807,3108,3107,3089,3088,3109,3090,2995,2137,2136];const r=JSON.parse(fs.readFileSync('../out/rft.json','utf8'));
(async()=>{for(const n of ns){const w=await g(W+'/work-items/NDC-'+n+'/?expand=labels,state');const e={id:w.id,seq:n,pri:w.priority,mod:'CRM',name:w.name,labels:(w.labels||[]).map(l=>l.name)};const i=r.findIndex(x=>x.seq===n);if(i>=0)r[i]=e;else r.push(e);console.log(n,w.state?.name,w.priority);}
fs.writeFileSync('../out/rft.json',JSON.stringify(r,null,1));})();

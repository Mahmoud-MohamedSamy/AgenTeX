const fs=require('fs');const rows=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/).map(l=>l.split(','));
const ki=rows[0].findIndex(h=>/secret key/i.test(h));const KEY=rows[1][ki>=0?ki:rows[0].length-1].replace(/"/g,'').trim();
const W='https://api.plane.so/api/v1/workspaces/ahmed-hegazy';const g=async u=>{for(let i=0;i<4;i++){try{return await (await fetch(u,{headers:{'x-api-key':KEY}})).json()}catch(e){await new Promise(r=>setTimeout(r,3000))}}};
const ns=fs.readdirSync('specs').map(f=>+f.match(/\d+/)[0]);
(async()=>{const out=[];for(const n of ns){const w=await g(W+'/work-items/NDC-'+n+'/?expand=labels,state');out.push({id:w.id,seq:n,pri:w.priority,mod:'Desk',name:w.name,labels:(w.labels||[]).map(l=>l.name),state:w.state?.name});}
fs.writeFileSync('../out/rft.json',JSON.stringify(out,null,1));console.log(out.map(x=>x.seq+' '+x.state+' '+x.pri).join('\n'));})();

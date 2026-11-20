const fs=require('fs');const rows=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/).map(l=>l.split(','));
const ki=rows[0].findIndex(h=>/secret key/i.test(h));const KEY=rows[1][ki>=0?ki:rows[0].length-1].replace(/"/g,'').trim();
const W='https://api.plane.so/api/v1/workspaces/ahmed-hegazy';
const g=async u=>{for(let i=0;i<4;i++){try{return await (await fetch(u,{headers:{'x-api-key':KEY}})).json()}catch(e){await new Promise(r=>setTimeout(r,3000))}}};
const max=+process.env.MAX||1800;
(async()=>{for(const n of process.argv.slice(2)){const w=await g(W+'/work-items/NDC-'+n+'/?fields=name,description_html');
const t=(w.description_html||'').replace(/<\/(p|li|h\d)>/g,'\n').replace(/<li>/g,'- ').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/\n\s*\n+/g,'\n').replace(/\S+@\S+\.\S+/g,'<email>');
fs.writeFileSync('../out/desc-'+n+'.txt',t);console.log('=== NDC-'+n+' '+w.name+'\n'+t.slice(0,max)+'\n');}})();

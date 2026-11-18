const fs=require('fs');const rows=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/).map(l=>l.split(','));
const ki=rows[0].findIndex(h=>/secret key/i.test(h));const H={'X-API-Key':rows[1][ki>=0?ki:rows[0].length-1].replace(/"/g,'').trim(),'Content-Type':'application/json'};
const B='https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
(async()=>{let L=[],c='';for(let i=0;i<8;i++){const j=await (await fetch(B+'/labels/?per_page=100'+(c?'&cursor='+c:''),{headers:H})).json();L=L.concat(j.results||[]);if(!j.next_page_results)break;c=j.next_cursor;}
const m=L.filter(l=>/\bapi\b/i.test(l.name));console.log('matches',JSON.stringify(m.map(l=>[l.name,l.id])));
if(process.argv[2]==='set'){const id=process.argv[3];const r=await fetch(B+'/work-items/14ce0fca-861d-4564-81e8-fed89fe3f56d/',{method:'PATCH',headers:H,body:JSON.stringify({labels:[id]})});const w=await r.json();console.log(r.status,JSON.stringify((w.labels||[])));}})();

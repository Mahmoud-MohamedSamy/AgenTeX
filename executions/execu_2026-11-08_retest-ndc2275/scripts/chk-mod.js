const fs=require('fs');const KEY=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g,'').trim();
const W='https://api.plane.so/api/v1/workspaces/ahmed-hegazy';const P=W+'/projects/efce4d84-5876-4015-b472-2efca7ad73f3';const h={'X-API-Key':KEY};const id=JSON.parse(fs.readFileSync('../out/plane-filed-I12.json','utf8')).id;
(async()=>{const mo=(await (await fetch(P+'/modules/?per_page=100',{headers:h})).json());const mod=(mo.results||mo).find(m=>/^Desk$/i.test(m.name));
 let cur='',found=false,n=0;for(let i=0;i<40;i++){const r=await (await fetch(P+'/modules/'+mod.id+'/module-issues/?per_page=100'+(cur?'&cursor='+cur:''),{headers:h})).json();const L=r.results||[];n+=L.length;if(L.some(x=>(x.id||x.issue)===id||JSON.stringify(x).includes(id))){found=true;break;}if(!r.next_page_results)break;cur=r.next_cursor;}
 const w=await (await fetch(W+'/work-items/NDC-2824/?fields=id,module_ids,modules',{headers:h})).json();
 console.log('found in Desk module:',found,'| scanned',n,'| item modules field:',JSON.stringify(w.module_ids||w.modules||null));})();

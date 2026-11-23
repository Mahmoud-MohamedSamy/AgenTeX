const fs=require('fs');const rows=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/).map(l=>l.split(','));
const ki=rows[0].findIndex(h=>/secret key/i.test(h));const KEY=rows[1][ki>=0?ki:rows[0].length-1].replace(/"/g,'').trim();
const B='https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';const id='420ceac2-acc7-4021-a443-e22789079ad9';
const g=async p=>(await fetch(B+p,{headers:{'x-api-key':KEY}})).json();
(async()=>{const w=await g('/work-items/'+id+'/?expand=labels,assignees,state');const a=await g('/work-items/'+id+'/attachments/');
console.log(w.name,'|',w.priority,'|',w.state.name,'|',w.labels.map(l=>l.name),'|',w.assignees.map(x=>x.display_name),'| attach',(a.results||a).map(x=>x.attributes?x.attributes.name:x.asset));})();

eval(fs.readFileSync('wf/lib.js','utf8'));const o={};const TG='883ef82a-cc1f-4271-a2ca-451d6027fc46';
let d=await api('DELETE','/desk/tags/'+TG+'?confirm=true');o.tag1=d.s+' '+(d.s>=300?d.t.slice(0,150):'');
if(d.s>=300){d=await api('DELETE','/desk/tags/'+TG,{confirm:true});o.tag2=d.s+' '+(d.s>=300?d.t.slice(0,150):'');}
if(d.s<300)led('desk tag 883ef82a QA RT21 WF F03 newtag deleted');
const tags=(await api('GET','/desk/tags?take=500')).j?.data?.tags||[];o.tagLeft=tags.filter(t=>/QA RT21/.test(t.name)).map(t=>t.name);
const ids=JSON.parse(fs.readFileSync(OUTD+'fin-ids.json','utf8')).tks;
const rb=await api('GET','/audit/recycle-bin/items?app_key=desk&q=QA%20RT21%20WF&limit=200');const items=arr(rb.j?.data);o.rbFound=rb.s+' '+items.length+' keys '+Object.keys(items[0]||{}).join(',');
const mine=items.filter(x=>/QA RT21 WF/.test(JSON.stringify(x)));o.mine=mine.length;
if(mine.length){const p=await api('POST','/audit/recycle-bin/delete',{ids:mine.map(x=>x.id)});o.purge=p.s+' '+p.t.slice(0,200);if(p.s<300)led(`purged ${mine.length} QA RT21 WF items from Recycle Bin`);}
return o;

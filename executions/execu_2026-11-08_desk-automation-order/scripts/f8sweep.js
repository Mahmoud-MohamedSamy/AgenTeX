const T='88e8ea44-1658-4df3-9930-d0902b91073d';const hits=[];let pages=0;
for(let p=1;p<=12;p++){const r=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100&sort_by=created_at&sort_dir=desc');const L=r.j?.data||[];pages=p;if(!L.length)break;
 for(const x of L){const g=k=>x.data.find(e=>e.field===k)?.value?.value;const s=String(g('subject')||'');if(/AOF8/.test(s))hits.push([x.id,g('ticket_number'),s.slice(0,50),g('status'),x.created_at?.slice(0,16)]);}}
fs.writeFileSync('../f8-left2.json',JSON.stringify(hits));return {pages,hits:hits.map(h=>h.slice(1).join(' | '))};

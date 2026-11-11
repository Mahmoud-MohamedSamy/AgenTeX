const B='/modules/'+L+'/blueprints/'+I.BP; let g=await api('GET',B); const o={get:SR(g), active:g.j&&g.j.data&&g.j.data.isActive};
let r=await api('DELETE',B); o.del1=SR(r)+' '+r.t.slice(0,300);
if(r.s>=300){ const ver=g.j.data.rowVersion||g.j.data.row_version||g.j.data.version; r=await api('DELETE',B+'?expected_version='+ver); o.del2=SR(r); if(r.s>=300){ r=await api('DELETE',B+'?force=true'); o.del3=SR(r);} }
const list=arr((await api('GET','/modules/'+L+'/blueprints?includeInactive=true')).j.data).filter(b=>/QA GS1111/.test(JSON.stringify(b))).map(b=>b.id); o.left=list;
LED('blueprint delete retry '+JSON.stringify(o)); return o;

const o={};
// NDC-2868 save without row_version
let r=await mkSet('QA RT17 GS 2868',['A','B'],'S68'); o.mk=SR(r);
let g=await gs(I.S68); const v0=g.row_version;
r=await api('PUT','/global-sets/'+I.S68,{name:g.name,description:'edit one',colors_enabled:false,values:g.values,row_version:g.row_version}); o.put1=SR(r);
const g1=await gs(I.S68);
r=await api('PUT','/global-sets/'+I.S68,{name:g.name,description:'no version save',colors_enabled:false,values:g.values}); o.putNoVer=SR(r)+' '+(r.s>=300?r.t.slice(0,250):'');
r=await api('PUT','/global-sets/'+I.S68,{name:g.name,description:'stale save',colors_enabled:false,values:g.values,row_version:v0}); o.putStale=SR(r);
const g2=await gs(I.S68); o.versions=[v0,g1.row_version,g2.row_version]; o.descNow=g2.description;
RES('2868', /^40[09]/.test(o.putNoVer)&&g2.description==='edit one'?'PASS':'FAIL', JSON.stringify(o));
// NDC-2865 new field with global_set_id
const p={};
r=await mkSet('QA RT17 GS Tier',['Gold','Silver','Bronze'],'T'); p.set=SR(r);
r=await api('POST','/modules/'+L+'/fields',{fields:[{fieldName:'qa_rt17_tier',labels:{en:'QA RT17 Tier'},datatypeKey:'pick_list',datatypeOptions:{global_set_id:I.T},config:{}}]}); p.create=SR(r)+' '+(r.s>=300?r.t.slice(0,300):''); const id=fid(r); if(id){I.fT=id;SAVE();LED('field Leads qa_rt17_tier (from set) '+id);}
if(id){ const f=await fieldOf(L,id); p.dto=JSON.stringify(f.datatypeOptions).slice(0,300); const u=await api('GET','/global-sets/'+I.T+'/used-in'); p.usedIn=JSON.stringify(u.j.data).slice(0,400);
 const x=await mkRec('2865 Gold',{qa_rt17_tier:'Gold'}); p.recGold=x[0]; const y=await mkRec('2865 Nope',{qa_rt17_tier:'Nope'}); p.recNope=y[0]; }
RES('2865-api', id&&p.recGold<300&&p.recNope>=400?'PASS':'FAIL', JSON.stringify(p));
return {o,p};

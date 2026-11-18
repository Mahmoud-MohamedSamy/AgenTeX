const MK='2a73bbc0-efb3-4250-bf9b-2fdc98236794'; const o={};
const src=arr((await api('GET','/web-forms')).j.data)[0];
const def=JSON.parse(JSON.stringify(src.definition)); def.language='ar'; def.allowed_origins=[]; def.share_link_enabled=true; def.success_message='QA RT18 شكرا';
def.fields=def.fields.concat([{key:'description',placeholder:null,label:null,required:false,hidden:false,default_value:null,help:null}]);
const c=await api('POST','/web-forms',{kind:'advanced_form',name:'QA RT18 form',department_id:MK,layout_id:src.layout_id,is_enabled:true,definition:def});
o.create=c.s+' '+c.t.slice(0,300); const f=c.j&&c.j.data; if(!f) return o;
fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} web-form "QA RT18 form" (Marketing, Arabic) ${f.id} (Desk)\n`);
o.id=f.id; o.key=f.embed_key; o.lang=f.definition&&f.definition.language; o.preview=JSON.stringify(f.preview&&f.preview.fields&&f.preview.fields.map(x=>x.label)); o.dir=f.preview&&(f.preview.dir||f.preview.direction);
return o;

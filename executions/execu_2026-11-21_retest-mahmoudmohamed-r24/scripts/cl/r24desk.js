const TK='88e8ea44-1658-4df3-9930-d0902b91073d',CT='43004ce2-577f-4eda-b00a-0750fe40c3d4',RE=/QA RT24/;const o={del:{},fail:[]};
const val=x=>!x?undefined:x.kind==='array'?(x.items||[]).map(val):x.value;
const D=async(k,m,p,b)=>{const r=await api(m,p,b);o.del[k]=r.s;if(r.s>=300&&r.s!==404)o.fail.push(k+' '+r.s+' '+String(r.t).slice(0,150));};
const list=async(M,n=150)=>{const out=[];for(let pg=1;pg<=3;pg++){const r=await api('GET','/modules/'+M+'/records?page='+pg+'&per_page=100&sort_by=created_at&sort_dir=desc');const a=arr(r.j?.data);out.push(...a);if(a.length<100||out.length>=n)break;}return out;};
const fl=x=>{const d=x.data||[];return Array.isArray(d)?Object.fromEntries(d.map(y=>[y.field,val(y.value)])):d;};
// 1 assignment rule
const rules=arr((await api('GET','/desk/assignment-rules')).j?.data).filter(r=>RE.test(r.name||''));for(const r of rules)await D('rule '+r.name,'DELETE','/desk/assignment-rules/'+r.id);
// 2 blueprints
const bps=arr((await api('GET','/modules/'+TK+'/blueprints')).j?.data).filter(b=>RE.test(b.name||b.definition?.name||''));o.bpFound=bps.map(b=>b.name||b.definition?.name);
for(const b of bps){await api('PATCH','/modules/'+TK+'/blueprints/'+b.id,{isActive:false});await D('bp '+(b.name||b.id),'DELETE','/modules/'+TK+'/blueprints/'+b.id);}
// 3 web forms
const wf=arr((await api('GET','/web-forms')).j?.data).filter(f=>RE.test(f.name||''));for(const f of wf)await D('form '+f.name,'DELETE','/web-forms/'+f.id);
// 4 tickets
const tks=(await list(TK)).filter(x=>{const f=fl(x);return RE.test(String(f.subject||x.display_name||x.title||''));});o.tickets=tks.length;
for(const t of tks)await D('tk '+(fl(t).ticket_number||t.id),'DELETE','/modules/'+TK+'/records/'+t.id);
// 5 contacts
const cs=(await list(CT,300)).filter(x=>{const f=fl(x);return RE.test(String(f.last_name||f.full_name||x.display_name||''))||/qa\.rt24/.test(String(f.email||''));});o.contactsFound=cs.map(c=>{const f=fl(c);return f.last_name||c.display_name;});
for(const c of cs)await D('contact '+c.id.slice(0,8),'DELETE','/modules/'+CT+'/records/'+c.id);
return o;

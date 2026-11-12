const L=await modId('leads'); const own=JSON.parse(fs.readFileSync(IDS,'utf8'));
const target=own.ruleUI||null;
const l=await api('GET','/scoring-rules?module_id='+L); const items=arr(l.j&&l.j.data);
const c=await api('POST','/scoring-rules',{module_id:L,name:P+'lowpriv',is_active:true,entries:[ent('lead_source','eq','web',1)]}); if(c.j&&c.j.data&&c.j.data.id){I.rules=(I.rules||[]).concat(c.j.data.id);SAVE();}
const any=items[0]; let p='n/a',a='n/a',d='n/a';
if(any){p=(await api('PUT','/scoring-rules/'+any.id,{name:any.name,is_active:true,entries:any.entries.map(e=>({id:e.id,field_key:e.field_key,operator:e.operator,value:e.value,points:e.points})),row_version:any.row_version})).s; a=(await api('PATCH','/scoring-rules/'+any.id+'/active',{is_active:any.is_active})).s; d='skipped (would delete owner rule if allowed)';}
const rec=await api('GET','/modules/'+L+'/records?per_page=1');
return {list:l.s+' n='+items.length, create:SR(c).slice(0,150), put:p, patch:a, records:rec.s};

const depts = await api('GET','/desk/departments');
const d = arr(depts.j).map(x=>({id:x.id,name:x.name,vis:x.visibility??x.is_public??x.isPublic??x.display_in_help_center??null,keys:Object.keys(x).join(',')}));
const tech = d.filter(x=>/tech/i.test(x.name));
const c = await api('GET','/desk/contacts?search=mmohamed%40anyware.software');
const c2 = await api('GET','/desk/contacts?email=mmohamed%40anyware.software');
return {deptCount:d.length, sampleKeys:d[0]&&d[0].keys, tech, contactsSearch:{s:c.s,t:c.t.slice(0,600)}, contactsEmail:{s:c2.s,t:c2.t.slice(0,600)}};

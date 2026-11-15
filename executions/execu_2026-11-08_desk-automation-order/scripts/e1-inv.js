eval(fs.readFileSync('lib-as.js','utf8'));const M=JSON.parse(fs.readFileSync('../e1.json','utf8'));const HC='e74f2abb-e28d-400e-908c-f2c54862e389';const R={contact:M.contact};
const mask=o=>JSON.stringify(o).replace(/mahmoud\.mmohamedsamy/g,'G').slice(0,900);
R.contactRec=mask((await api('GET','/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/records/'+M.contact)).j?.data?.data?.filter?.(x=>/email|portal|help|name/i.test(x.field)));
for(const p of ['/help-centers/'+HC+'/invitations','/help-centers/'+HC+'/invitations?status=pending','/help-centers/'+HC+'/users','/help-centers/'+HC+'/members','/help-centers/'+HC+'/contacts/'+M.contact,'/help-centers/'+HC+'/portal-users']){const x=await api('GET',p);R[p.replace('/help-centers/'+HC,'')]=x.s+' '+mask(x.j?.data??x.j?.error).slice(0,600);}
const again=await api('POST','/help-centers/'+HC+'/invitations/contacts',{contact_ids:[M.contact]});R.inviteBody=again.s+' '+mask(again.j);
return R;

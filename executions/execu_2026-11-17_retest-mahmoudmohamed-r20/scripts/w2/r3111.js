const QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b',CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158',ACC='726771f4-c0a2-401c-8fde-3481e16881b1',TA='110de3b0-47e1-43cd-95e5-c59d439e00f4',OLD='b24570e3-0cce-4bb1-8775-02e268229f49';
const o={};const AT=t=>[{type:'AddTags',tagIds:t,mode:'append',order:0,delaySeconds:0}];
const tagsOf=async id=>JSON.stringify(((await api('GET','/workflow/rules/'+id)).j?.data?.actions||[]).map(a=>a.type+':'+(a.tagIds||[]).join('+')));
let r=await mkRule('3111 other',{kind:'RecordUpdated'},AT([ACC]),{isActive:false,departmentIds:[QAO]});o.a_createOther=r.res;
r=await mkRule('3111 own',{kind:'RecordUpdated'},AT([TA]),{isActive:false,departmentIds:[QAO]});o.b_createOwn=r.res;const OWN=r.id;
r=await mkRule('3111 mixed',{kind:'RecordUpdated'},AT([TA,ACC]),{isActive:false,departmentIds:[QAO]});o.c_createMixed=r.res;
r=await mkRule('3111 multi',{kind:'RecordUpdated'},AT([ACC]),{isActive:false,departmentIds:[QAO,CS]});o.d_createMultiDept=r.res;
r=await mkRule('3111 rem',{kind:'RecordUpdated'},[{type:'RemoveTags',tagIds:[ACC],order:0,delaySeconds:0}],{isActive:false,departmentIds:[QAO]});o.e_removeTagsOther=r.res;
if(OWN){let p=await api('PATCH','/workflow/rules/'+OWN,{actions:AT([ACC])});o.f_patchOwnToOther=short(p);o.f_storedAfter=await tagsOf(OWN);
 p=await api('PATCH','/workflow/rules/'+OWN,{name:'QA RT20 W2 3111 own renamed'});o.g_renameOwn=short(p);
 p=await api('PATCH','/workflow/rules/'+OWN,{departmentIds:[CS]});o.h_moveDeptKeepTag=short(p);}
o.i_oldBadBefore=await tagsOf(OLD);let p=await api('PATCH','/workflow/rules/'+OLD,{name:'QA RT20 W2 3058 bad'});o.i_oldBadRename=short(p);
p=await api('PATCH','/workflow/rules/'+OLD,{departmentIds:[QAO]});o.j_oldBadSameDept=short(p);
save('r3111',o);log(JSON.stringify(o,null,1));

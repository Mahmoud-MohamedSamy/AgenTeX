eval(require('fs').readFileSync('lib.js','utf8'));
const f=(await api('GET','/desk/assignment-rules/criteria-fields')).j.data.fields;
const pick=f.filter(x=>['contact.last_name','account.account_name','contact_id'].includes(x.key)).map(x=>({key:x.key,group:x.group,type:x.type,ops:x.operators.map(o=>o.key).join(',')}));
const r=await api('POST','/desk/assignment-rules',{type:'direct',name:'QA AS6 B09 probe',description:'QA',is_active:false,execute_on:['create'],targets:[{criteria:{conditions:[{field_key:'contact.last_name',operator:'equals',value:'QA AS6 B09'}],pattern:null},coming_to_department_id:IDS.DB,move_to_department_id:null,assign:AG(IDS.A2)}]});
const id=r.j?.data?.id;if(id){LED('rule direct "QA AS6 B09 probe" '+id+' (inactive)');}
const t=await getT('beead465-4044-4349-ae6a-c7fc95915d0a');
return {pick,s:r.s,e:E(r),id,t};

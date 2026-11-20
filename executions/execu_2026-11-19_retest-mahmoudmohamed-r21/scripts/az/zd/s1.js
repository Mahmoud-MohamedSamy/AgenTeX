async (page) => { EVAL
const TECH='1499272000000432293';const o={};
const st=await z('POST','/api/v1/skillTypes',{name:'QA RT20 AZ Type',departmentId:TECH});o.type=st.s+' '+(st.j?.id||st.t);const tid=st.j?.id;
const mkS=async(name,word,agents)=>{const r=await z('POST','/api/v1/skills',{name,skillTypeId:tid,status:'ACTIVE',agentIds:agents,criteria:{fieldConditions:[{condition:'contains',fieldName:'Subject',fieldModule:'tickets',value:[word]}],pattern:'1'}});return r.s+' '+(r.j?.id||r.t.slice(0,300))+' agents='+JSON.stringify(r.j?.agentIds);};
o.a=await mkS('QA RT20 AZ SkA','SKA',[ME]);o.c=await mkS('QA RT20 AZ SkC','SKC',[]);return o;}

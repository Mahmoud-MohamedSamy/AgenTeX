async (page) => { EVAL
const a=await z('GET','/api/v1/blueprints/1499272000000432068');const b=await z('GET','/api/v1/blueprints?departmentId='+DEPT);const t=await z('GET','/api/v1/tickets/1499272000000483192/transitions');
return {one:a.s+' '+a.t.slice(0,400),list:b.s+' '+b.t.slice(0,600),tr:t.s+' '+t.t.slice(0,600)};}

const o={};for(const p of ['/desk/sla/meta','/desk/sla','/desk/sla/policies?department_id=ff2611f5-4c5b-4cd2-8853-dd8767f401b6']){const r=await api('GET',p);o[p]=r.s+' '+r.t.slice(0,700);}return o;

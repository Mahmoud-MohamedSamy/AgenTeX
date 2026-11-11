const t=await api('GET','/desk/email-templates/e5a989e6-22f4-4d74-a21f-e9cabae8d803');
const p=(await api('GET','/desk/sla/policies/ea75d2cb-cc86-440a-ad29-2da03f5c8ac4')).j?.data;
return {template:t.s+' '+t.t.slice(0,150),ref:p.targets[0].escalations.response[0].template_ref};

const p=(await api('GET','/desk/sla/policies/1f2535af-39ec-4fe6-9704-572b406a3481')).j?.data;const t=p.targets[0];
return {active:p.is_active,response:t.response,escalation:t.escalations.response};

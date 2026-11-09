const id=process.env.ID||'d8746d4e-923b-45a7-abbb-e826e9e0cf40';
const e=await X.executions(id);
return e.map(x=>({rule:x.ruleId?.slice(0,8),at:x.evaluatedAt,outcome:x.outcome,d:(x.dispatches||[]).map(d=>[d.actionType,d.target,d.status,d.lastError,String(d.responseBodyTruncated).slice(0,200)])}));

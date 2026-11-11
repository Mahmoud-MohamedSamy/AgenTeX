const r=(await api('GET','/desk/assignment-rules?type=direct&department_id=b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6')).j?.data?.rules||[];
const h=r.find(x=>x.name==='QA RT14 2814 holiday');const hl=(await api('GET','/desk/holiday-lists')).t.slice(0,600);
return {crit:JSON.stringify(h?.targets?.[0]?.criteria),dept:h?.department_id,hl};

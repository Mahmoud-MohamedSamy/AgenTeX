const r=(await api('GET','/desk/assignment-rules?type=direct')).j?.data?.rules||[];
return ['QA AS6 DA D01','QA AS6 DA D06 move','QA AS6 DA D05 team','QA AS6 DA D08 unassigned','QA AS6 DA D09 update'].map(n=>JSON.stringify(r.find(x=>x.name===n)).slice(0,900));

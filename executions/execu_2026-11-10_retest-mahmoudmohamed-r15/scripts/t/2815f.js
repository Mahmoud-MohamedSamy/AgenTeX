const T='88e8ea44-1658-4df3-9930-d0902b91073d', L='1b55c25d-eb27-4046-afd1-b292398b435b';
const d=(await api('GET','/modules/'+T+'/layouts/'+L)).j.data; const s=JSON.stringify(d); return {hasQA: /QA RT15/.test(s), rowVersion:d.rowVersion};

eval(require('fs').readFileSync('lib.js','utf8'));
const f=(await api('GET','/desk/assignment-rules/criteria-fields')).j.data;
const groups=Array.isArray(f)?f:(f.groups||f.fields||Object.values(f));
const flat=JSON.stringify(f);
const t=await getT(IDS.TK_SK1);
return {top:Object.keys(f).slice(0,10),contact:(flat.match(/"key":"contact[^"]*"|"key":"account[^"]*"/g)||[]).slice(0,40),sample:flat.slice(0,600),ticketKeys:Object.keys(t),contactVal:t.contact||t.contact_id||t.contact_name||null,account:t.account||t.account_id||null};

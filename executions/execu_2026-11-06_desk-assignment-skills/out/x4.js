eval(require('fs').readFileSync('lib.js','utf8'));
const out={};for(const id of ['91a347b5-b5ce-4d1c-b233-01a230b995de','683ab848-1ce3-415c-b13f-d3e1823b7799']){const a=await act(id);out[id.slice(0,8)]=(Array.isArray(a)?a:[]).reverse().map(x=>x.action+' '+JSON.stringify(x.summary||{}).slice(0,230)+' by '+(x.actor_name||x.actor_id||x.user_id||'').toString().slice(0,30));}
return out;

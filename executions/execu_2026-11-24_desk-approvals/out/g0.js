const o = {};
const f = (await api.O('GET', '/web-forms/' + ST.FORM)).j?.data; o.fields = (f.definition.fields || []).map(x => x.key + (x.required ? '*' : '')); o.review = f.definition.review; o.enabled = f.is_enabled; o.dept = f.department_id === ST.D1;
const ws = await fetch(`https://staging-desk.taviportal.com/api/v1/web-forms/public/${ST.FORM_KEY}/session`, { method: 'POST', headers: { Origin: 'https://staging-desk.taviportal.com', Referer: 'https://staging-desk.taviportal.com/embed/feedback/index.html' } }); o.session = ws.status;
return o;

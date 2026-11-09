const out = {};
out.qaModules = (await call('GET', '/modules')).j.data.filter(m => /^qa_w5/.test(m.moduleKey)).map(m => m.moduleKey + ' ' + m.id);
out.teamspaces = ((await call('GET', '/teamspaces')).j.data || []).filter(t => /QA W5/.test(t.name)).map(t => t.name + ' ' + t.id);
out.datatype = (await call('GET', '/custom-datatypes')).t.includes('qa_w5_dt');
out.clients = JSON.stringify((await call('GET', '/iam/integrations/clients')).j.data).match(/QA W5[^"]*/g);
const rep = (await call('GET', '/reporting/reports')).j.data; out.reports = JSON.stringify(rep).match(/QA W5[^"]*/g);
const dash = (await call('GET', '/reporting/dashboards')).j.data; out.dashboards = JSON.stringify(dash).match(/"id":"[^"]+","name":"(Untitled dashboard|QA W5[^"]*)"/g);
const cat = (await call('GET', '/iam/skills/catalog')).t; out.skills = cat.match(/QA W5[^"]*/g);
return out;

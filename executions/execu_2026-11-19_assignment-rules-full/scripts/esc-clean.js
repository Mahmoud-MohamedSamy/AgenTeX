const o = {};
o.tickets = []; for (const k of ['TK_ESC_Y', 'TK_ESC_N', 'TK_ESC_Y2', 'TK_ESC_N2']) if (IDS[k]) o.tickets.push((await api('DELETE', '/modules/' + T + '/records/' + IDS[k])).s);
o.rule = IDS.ESC_RULE ? (await api('DELETE', '/desk/assignment-rules/' + IDS.ESC_RULE)).s : 'none';
o.sla = IDS.ESC_SLA ? (await api('DELETE', '/desk/sla/policies/' + IDS.ESC_SLA)).s : 'none';
const b = JSON.parse(fs.readFileSync(RUN + '/out/prefsDA-esc-before.json', 'utf8')); o.prefs = (await api('PUT', '/desk/departments/' + IDS.DA + '/round-robin-preferences', b)).s;
const now = await prefsG(IDS.DA); o.prefsSame = JSON.stringify(Object.keys(b).map(k => now[k])) === JSON.stringify(Object.keys(b).map(k => b[k]));
const pol = (await api('GET', '/desk/sla/policies?department_id=' + IDS.DA)).j; o.slaLeft = JSON.stringify(pol).includes('QA AR ESC');
LED('ESC cleanup: ' + JSON.stringify(o)); return o;

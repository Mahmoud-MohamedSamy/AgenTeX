// SL-18 check (owner): after the user's Gmail replies, did the response obligation restart? ON: no new response; OFF: a new response cycle.
const R = JSON.parse(fs.readFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad/sl18.json', 'utf8'));
const out = {};
for (const k of ['on', 'off']) {
  const x = R.t[k]; const s = (await api('GET', '/desk/tickets/' + x.ticket + '/sla')).j?.data;
  const feed = (await api('GET', '/desk/tickets/' + x.ticket + '/activity')).t;
  out[k] = { ticket: x.number, obligations: (s?.obligations || []).map(o => o.kind + ':' + o.state + ':cycle' + o.cycle + ':due ' + o.due_at), customerReplied: /customer_repl|thread\.received|reply\.received|inbound/.test(feed), feed: (feed.match(/"action":"[a-z_.]+"/g) || []).join(' ') };
}
return out;

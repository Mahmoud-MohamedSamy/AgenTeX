const S = JSON.parse(fs.readFileSync('../a4/e2e134.json')); const TPL = S.made.tpl[0]; const AID = S.made.actions[0];
const sa = (await api('GET', '/workflow/actions/' + AID)).j?.data; const R = {};
for (const rc of [{ kind: 'contact', value: 'contact' }, { kind: 'contact', value: 'email' }, { kind: 'userfield', value: 'email' }, { kind: 'field', value: 'email' }, { kind: 'email', value: 'mahmoud.mmohamedsamy+qaao@gmail.com' }]) {
  const p = await api('PATCH', '/workflow/actions/' + AID, { action: { ...(sa.action || {}), type: 'Email', order: 0, delaySeconds: 0, emailRecipients: [rc], emailTemplateId: TPL, emailSubject: 'x', emailBody: 'x' } });
  R[rc.kind + ':' + rc.value.slice(0, 12)] = p.s + (p.s >= 300 ? ' ' + (p.j?.error?.details?.[0]?.message || p.j?.error?.message || '').slice(0, 120) : ''); if (p.s < 300) break; }
log(JSON.stringify(R, null, 1));

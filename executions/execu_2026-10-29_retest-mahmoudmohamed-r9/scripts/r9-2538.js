// NDC-2538 (what can be checked without a public catcher): webhook URL on the QA review process (inactive), signing secret create/rotate.
// The secret value is never printed — only whether it exists and its length.
const out = {}; const RP = 'bd081d46-b273-4579-9025-8c6e12c51219';
const g = (await api('o', 'GET', '/workflow/review-processes/' + RP)).j?.data;
const keep = ['layoutId', 'name', 'description', 'criteria', 'channels', 'fields', 'rules', 'notifications', 'sla', 'retentionDays', 'notifyOnAutoDelete', 'adminUserIds', 'allowAdminEdit', 'rejectionReasons', 'eventFunctions'];
const base = Object.fromEntries(keep.filter(k => k in g).map(k => [k, g[k]]));
const internal = await api('o', 'PATCH', '/workflow/review-processes/' + RP, { ...base, webhookUrl: 'http://127.0.0.1:8080/qa-rt-2538' }); out.internalUrl = internal.s + ' ' + (internal.j?.error?.message || '').slice(0, 160);
const p = await api('o', 'PATCH', '/workflow/review-processes/' + RP, { ...base, webhookUrl: 'https://example.invalid/qa-rt-2538' }); out.setUrl = p.s + ' ' + (p.s > 299 ? p.t.slice(0, 200) : '');
out.storedUrl = (await api('o', 'GET', '/workflow/review-processes/' + RP)).j?.data?.webhookUrl;
const shape = r => { const d = r.j?.data; const v = d && (d.secret || d.signingSecret || d.value || (typeof d === 'string' ? d : null)); return r.s + ' keys=' + JSON.stringify(d ? Object.keys(typeof d === 'object' ? d : {}) : null) + ' secretPresent=' + !!v + (v ? ' len=' + String(v).length : ''); };
out.secretBefore = shape(await api('o', 'GET', `/workflow/review-processes/${RP}/webhook-secret`));
out.rotate = shape(await api('o', 'POST', `/workflow/review-processes/${RP}/webhook-secret/rotate`, {}));
out.secretAfter = shape(await api('o', 'GET', `/workflow/review-processes/${RP}/webhook-secret`));
ledger(`review process ${RP}: webhookUrl https://example.invalid/qa-rt-2538 + signing secret rotated (NDC-2538) — process deleted at cleanup`);
return out;

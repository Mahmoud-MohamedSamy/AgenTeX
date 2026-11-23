const t = L((await api('GET', '/mail/templates')).j?.data); const s = t.find(x => /introduction/i.test(x.name)) || t[0]; log('shape', JSON.stringify(Object.keys(s)), JSON.stringify(s).slice(0, 500));
const body = { ...Object.fromEntries(Object.entries(s).filter(([k]) => !/^(id|created|updated|owner|is_default|isDefault|favorite|usage)/i.test(k))), name: 'QA FX I9 formula merge', subject: 'QA FX I9 {{qa_fx_ui_double}}' };
for (const k of ['body', 'html', 'body_html', 'content', 'bodyHtml']) if (k in s) body[k] = '<p>Double={{qa_fx_ui_double}} Num={{qa_num}} Name={{name}}</p>';
const r = await api('POST', '/mail/templates', body); log('create', E(r).slice(0, 300)); const id = r.j?.data?.id; if (id) { made.mailTemplate = id; keep(); led('CRM mail template QA FX I9 ' + id); }

const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/ids2.json'; const ids = JSON.parse(fs.readFileSync(OUT, 'utf8'));
const src = arr((await api('GET', '/web-forms?app=desk')).j).find(x => x.name === 'Customer Support Webform');
const def = { ...src.definition, allowed_origins: [], share_link_enabled: true, captcha_enabled: false };
const r = await api('POST', '/web-forms?app=desk', { app: 'desk', kind: 'advanced_form', name: 'QA RT22 DA form', department_id: src.department_id, layout_id: src.layout_id, module_id: src.module_id, definition: def });
log({ create: r.s, t: r.s >= 300 ? r.t.slice(0, 400) : undefined });
const f = r.j?.data; if (f) { ids.form = f.id; fs.writeFileSync(OUT, JSON.stringify(ids, null, 1)); log({ enabled: f.is_enabled, share: f.share_url ? 'yes' : f.share_url, owner: JSON.stringify(f.definition?.owner) });
  fs.writeFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/3d6c9864-52e6-4e9d-95a9-14042dfac39c/scratchpad/wf-key.txt', f.embed_key); fs.writeFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/3d6c9864-52e6-4e9d-95a9-14042dfac39c/scratchpad/wf-share.txt', f.share_url || ''); }

const w = (await api('GET', '/web-forms/dfff0af0-a0aa-45b2-8b46-3b3aaa187a3c')).j?.data;
log(JSON.stringify({ enabled: w.is_enabled, channel: w.channel_enabled, share: w.share_url, captcha: w.captcha_available, key: w.embed_key ? 'yes' : 'no', fields: (w.definition?.fields || []).map(f => ({ f: f.fieldName || f.field || f.key, req: f.required })) }).slice(0, 900));
fs.writeFileSync(RUN + '/out/webform.json', JSON.stringify({ key: w.embed_key, share: w.share_url }));

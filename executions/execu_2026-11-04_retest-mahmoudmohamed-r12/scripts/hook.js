// shared response hook for UI specs: records every API call (no auth, no bodies of iam)
module.exports = (page, reqs) => page.on('response', async r => { const u = r.url(); const m = r.request().method();
  if (!/api\/v1/.test(u) || m === 'OPTIONS' || /notif|reminder|i18n|presence|unread|\/iam\//.test(u)) return;
  let n = ''; try { const j = await r.json(); n = (j.meta && (j.meta.total ?? j.meta.total_count)) ?? ''; } catch (e) { }
  reqs.push(m + ' ' + r.status() + ' total=' + n + ' ' + decodeURIComponent(u.replace(/^.*api\/v1/, '')).replace(/view_id=[^&]+&/, '').slice(0, 250) + ' ' + (r.request().postData() || '').slice(0, 400)); });

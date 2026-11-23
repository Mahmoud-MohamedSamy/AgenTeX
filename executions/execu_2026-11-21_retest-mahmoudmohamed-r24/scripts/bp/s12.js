const mask = ip => { if (!ip) return 'none'; const s = String(ip); if (/172\.|10\.|127\.|::1|::ffff/.test(s)) return s; return s.split('.').slice(0, 2).join('.') + '.x.x'; };
let all = []; let cur = null; let meta;
for (let p = 1; p <= 12; p++) { const r = await api('GET', '/audit/events?limit=100' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const Lx = L(r.j?.data); meta = r.j?.meta; all = all.concat(Lx); cur = meta?.next_cursor; if (!Lx.length || !cur || Lx[Lx.length-1].occurred_at < '2026-11-17') break; }
const ids = new Set(); all = all.filter(x => !ids.has(x.event_id) && ids.add(x.event_id));
const today = all.filter(x => x.occurred_at >= '2026-11-17');
const tab = {}; for (const x of today) { const k = x.actor_type + ' | ' + (/login|logout|sign/i.test(x.action) ? 'auth' : 'change') + ' | ' + x.source_channel + ' | ' + mask(x.source_ip); tab[k] = (tab[k] || 0) + 1; }
const mine = today.filter(x => /QA RT20 BP|e04e88df|f2b2c1f5|f85fde0c/.test(JSON.stringify(x))).map(x => x.occurred_at.slice(11, 19) + ' ' + (x.actor_label || '').replace(/@.*/, '') + ' ' + x.action + ' ' + x.target_type + ' "' + String(x.target_label).slice(0, 40) + '" ip=' + mask(x.source_ip) + ' ch=' + x.source_channel);
const internal = today.filter(x => /172\.19|::ffff/.test(String(x.source_ip))).length;
const det = s => today.filter(s).map(x => x.occurred_at.slice(11, 19) + " " + x.actor_type + " " + (x.actor_label || "-").replace(/@.*/, "") + " " + x.app_key + " " + x.action.replace("audit.action.", "") + " " + x.target_type.replace("audit.entity.", "") + " \"" + String(x.target_label).slice(0, 30) + "\" ua=" + String(x.source_user_agent || "").slice(0, 25));
const tb = {}; for (const x of today.filter(x => x.actor_type === "user")) { const k = x.app_key + " | " + (/Mozilla/.test(x.source_user_agent) ? "browser" : /curl/.test(x.source_user_agent) ? "curl" : x.source_user_agent ? "other:" + String(x.source_user_agent).slice(0, 12) : "no-ua") + " | " + (!x.source_ip ? "none" : /172.19/.test(x.source_ip) ? "172.19.0.19" : "public"); tb[k] = (tb[k] || 0) + 1; }
const iam = det(x => x.app_key === "iam" && x.source_ip && !/login|logout/.test(x.action)).slice(0, 12);
return { tb, iam };

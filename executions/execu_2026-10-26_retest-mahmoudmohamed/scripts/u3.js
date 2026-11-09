// Find workflow kinds in the loaded JS bundles (read-only).
const urls = await page.evaluate(() => performance.getEntriesByType('resource').map(e => e.name).filter(u => /\.js(\?|$)/.test(u)));
const hits = {}; const re = /"(CustomerReply|AgentResponse|PrivateThread|CommentAdded|Comment|HappinessRating|TicketEvent)[A-Za-z]*"/g;
const kinds = new Set(); const acts = new Set();
for (const u of urls) { const r = await page.context().request.get(u).catch(() => null); if (!r) continue; const t = await r.text();
  for (const m of t.matchAll(/kind:"([A-Za-z]+)"/g)) kinds.add(m[1]);
  for (const m of t.matchAll(/type:"([a-z_]+)"/g)) acts.add(m[1]);
  for (const m of t.matchAll(/"(ticket_event|customer_reply|agent_response|private_thread|happiness_rating|comment_added|add_comment|send_email_reply|add_followers|mark_spam|mark_as_spam|share_ticket|change_layout|add_skills|remove_skills|recalculate_skills|reassign_by_skills|update_related_record)"/g)) hits[m[1]] = (hits[m[1]] || 0) + 1; }
return done({ n: urls.length, kinds: [...kinds].filter(k => /Reply|Response|Thread|Comment|Happiness|Ticket|Record|Field|Date/.test(k)), hits, acts: [...acts].filter(a => /comment|reply|follow|spam|share|layout|skill|related|email|owner|chat|slack|teams|instant|custom/.test(a)).slice(0, 60) });

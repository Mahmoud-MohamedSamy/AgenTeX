// Read-only: email channel + mail state (addresses only, no secrets), snippets/templates, ticket settings
const out = {}; const red = s => s.replace(/("(?:password|secret|token|api_key|client_secret|refresh_token|access_token)"\s*:\s*)"[^"]*"/gi, '$1"***"');
for (const p of ['/desk/channels/addresses', '/desk/channels/from-addresses', '/desk/channels/settings', '/desk/channels/sending-overview', '/desk/channels/mailboxes', '/desk/channels/suppressions', '/mail/connections', '/mail/platform/status', '/mail/sender/system', '/mail/signatures/me', '/desk/email-templates', '/desk/ticket-access/settings', '/desk/tickets/archive/settings', '/desk/me/preferences'])
  { const r = await api('GET', p); out[p] = { s: r.s, t: red(r.t).slice(0, 1500) }; }
return done(out);

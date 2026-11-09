const x = (page.__cap || []).filter(r => !/\/iam\/auth|realtime-ticket|resolved-batch/.test(r.u))
  .map(r => ({ ...r, req: String(r.req).replace(/("(access_token|refresh_token|ticket|password)"\s*:\s*")[^"]+/g, '$1<redacted>'), res: String(r.res).replace(/("(access_token|refresh_token|ticket|password)"\s*:\s*")[^"]+/g, '$1<redacted>') }));
page.__cap = []; return x;

const r = await api('POST', '/iam/users/invitations/f56966bb-4d14-4de1-b244-afa4f1cefc27/resend', {});
log('resend', r.s, r.t.slice(0, 250).replace(/[\w.+-]+@[\w.-]+/g, '<email>').replace(/[A-Za-z0-9_-]{24,}/g, m => '<tok ' + m.length + '>'));

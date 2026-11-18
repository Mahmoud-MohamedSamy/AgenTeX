out.comment = await prr('POST', '/desk/tickets/' + TK.R2 + '/comments', { body_html: '<p>QA AC2 B comment on spam ticket</p>', is_private: true });
out.reply = await prr('POST', '/desk/tickets/' + TK.R2 + '/replies', { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA AC2 R2', body_html: '<p>QA AC2 spam reply test (please ignore)</p>' });
out.reshare = await prr('PUT', '/desk/tickets/' + TK.R2 + '/shares', { shares: [{ department_id: DEP.CS, access: 'full' }] });
out.unspam = await prr('DELETE', '/desk/tickets/' + TK.R2 + '/spam');
return fin({ out });

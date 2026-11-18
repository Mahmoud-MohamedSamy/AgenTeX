out.share = await prr('PUT', '/desk/tickets/' + TK.R2 + '/shares', { shares: [{ department_id: DEP.CS, access: 'read_only' }] });
return fin({ out });

out.share1 = await prr('PUT', '/desk/tickets/' + TK.R1 + '/shares', { shares: [{ department_id: DEP.CS, access: 'full' }] });
out.share2 = await prr('PUT', '/desk/tickets/' + TK.R2 + '/shares', { shares: [{ department_id: DEP.CS, access: 'full' }] });
return fin({ out });

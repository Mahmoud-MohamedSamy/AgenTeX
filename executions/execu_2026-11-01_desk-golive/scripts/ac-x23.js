out.share = await prr('PUT', '/desk/tickets/' + TK.R1 + '/shares', { shares: [{ department_id: DEP.CS, access: 'restricted' }] });
return fin({ out });

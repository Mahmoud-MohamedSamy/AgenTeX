out.r = await prr('PUT', '/desk/departments/' + DEP.CS + '/team-assignment', { enabled: true }); out.final = D((await api('GET', '/desk/departments/' + DEP.CS)).j).team_assignment_enabled;
return fin({ out });

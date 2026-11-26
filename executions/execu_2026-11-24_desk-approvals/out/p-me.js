const g = await api.B('GET', '/iam/me/profile'); const g2 = await api.B('GET', '/iam/me');
return { profile: g.s + ' ' + g.t.slice(0, 900), me: g2.s + ' ' + (g2.t.match(/"(locale|language|time_?zone|timeZone|date_?format|dateFormat|time_format)[^,]*/gi) || []).join(' ') };

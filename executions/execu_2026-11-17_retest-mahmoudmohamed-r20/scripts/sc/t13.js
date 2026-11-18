const o = {};
for (const w of [I.wf, I.wf2]) { const d = await api('POST', '/workflow/rules/' + w + '/deactivate'); o['deact ' + w.slice(0, 8)] = SR(d).slice(0, 120); const g = await api('GET', '/workflow/rules/' + w); o['state ' + w.slice(0, 8)] = g.j.data.isActive; LED('workflow rule ' + w + ' deactivate -> isActive ' + g.j.data.isActive); }
return o;

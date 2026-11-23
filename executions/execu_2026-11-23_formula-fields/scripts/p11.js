const lay = (await api('GET', `/modules/${made.mod}/layouts/${made.layouts[0]}`)).j.data;
for (const v of Object.keys(lay.views)) log(v, 'rowVersion', lay.views[v].rowVersion, lay.views[v].updatedAt, lay.views[v].layout.sections.map(s => s.label.en + ':' + s.columns.flatMap(c => c.fields.map(f => f.fieldName)).filter(n => /fx|formula/.test(n)).join(',')).join(' | '));

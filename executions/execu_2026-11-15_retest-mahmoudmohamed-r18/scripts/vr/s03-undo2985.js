const mid = await modId(); const d = await api('DELETE', '/modules/' + mid + '/field-permissions/' + I.fp2985); LED('restored: field permission ' + I.fp2985 + ' deleted ' + d.s + ' (qa_rt18_date back to default for profile User)');
return { del: d.s, left: arr((await api('GET', '/modules/' + mid + '/field-permissions')).j.data).filter(x => x.fieldName === 'qa_rt18_date').length };

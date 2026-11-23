const r = await mkRule('AC2r', { kind: 'RecordUpdated' }, [{ type: 'AddTags', tagIds: ['ba388a87-99b7-491e-ab91-2bba95ccd60a'], mode: 'replace' }]);
const a = arr((await api('GET', '/workflow/rules?moduleId=' + T + '&take=200')).j.data); const c = arr((await api('GET', '/workflow/rules?moduleId=' + T + '&take=500&skip=0')).j.data);
return { replace: r.s + ' ' + (r.err || ''), id: r.id, listed200: a.length, listed500: c.length };

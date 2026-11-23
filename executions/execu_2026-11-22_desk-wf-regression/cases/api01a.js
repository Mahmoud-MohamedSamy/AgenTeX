const r = await mkRule('API01ui', { kind: 'RecordCreated' }, [FU({ qa_ndc_company_name: 'v1' })], { departmentIds: [DEPT2], active: false, criteria: cmp('priority', 'Equal', S('high')) });
fs.writeFileSync(RUN + '/out/api01.json', JSON.stringify({ id: r.id })); const g = (await allRules()).find(x => x.id === r.id);
return { s: r.s, id: r.id, criteria: JSON.stringify(g.criteria).replace(/"[a-zA-Z]+":null,?/g, '').slice(0, 300) };

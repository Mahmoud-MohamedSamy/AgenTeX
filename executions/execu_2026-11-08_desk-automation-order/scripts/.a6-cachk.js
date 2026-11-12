const a = (await api('GET', '/workflow/custom-actions/52f80185-f971-4321-aafd-20d2bba0717f')).j?.data || {};
log(JSON.stringify({ name: a.name, targetApps: a.targetApps || a.target_apps, status: a.status }));
const m = JSON.parse(fs.readFileSync('../a6/made.json', 'utf8')); m.other = (m.other || []).concat([{ k: 'customAction', id: '52f80185-f971-4321-aafd-20d2bba0717f' }, { k: 'apiSource', id: '80412d3b-36db-4f6f-9044-49d62f5eae38' }]); fs.writeFileSync('../a6/made.json', JSON.stringify(m, null, 1));

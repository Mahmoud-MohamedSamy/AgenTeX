const f = await api('POST', `/modules/4e66c57e-5356-4dae-b4c0-9d27af7ea4f5/fields`, { fields: [fdef('fx_a11b', 'QA FX A11b', 'formula', { expression: '1 + 1', return_kind: 'number' })] }); log('A11 create formula as Desk agent', E(f));
const lay = await api('PUT', `/modules/4e66c57e-5356-4dae-b4c0-9d27af7ea4f5/fields/x`, {}); log('PUT field', lay.s);

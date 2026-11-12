const mid = await modId(); const f = (await fieldsOf(mid)).find(x => x.fieldName === 'lead_source'); return JSON.stringify(f.datatypeOptions || f.config).slice(0, 600);

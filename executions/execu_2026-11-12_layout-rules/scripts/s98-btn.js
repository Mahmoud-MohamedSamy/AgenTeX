const mid = await modId(); const g = (await api('GET', '/modules/' + mid + '/buttons/' + I.fx_btn)).j.data; const b = { ...g, placement: 'both' }; for (const k of ['id', 'moduleId', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'lastModifiedAt', 'lastModifiedBy']) delete b[k];
return SR(await api('PUT', '/modules/' + mid + '/buttons/' + I.fx_btn, b)).slice(0, 300);

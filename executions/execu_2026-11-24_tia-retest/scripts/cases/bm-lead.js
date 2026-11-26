const lead = arr((await api('GET', `/modules/${M.leads}/records?page=1&per_page=50&filters=${encodeURIComponent(JSON.stringify([{ field: 'first_name', operator: 'starts_with', value: 'QA AEO SH H-02' }]))}`)).j?.data)[0];
return arr(lead?.data).filter(x => /QA AEO/.test(JSON.stringify(x.value))).map(x => x.field + '=' + JSON.stringify(x.value?.value ?? x.value).slice(0, 60));

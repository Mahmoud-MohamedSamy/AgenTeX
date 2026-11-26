const bh = (await api('GET', '/desk/business-hours')).j?.data;
return { preset: bh.preset, days: bh.days_active, holidayLists: (bh.holiday_lists || []).length, profiles: (bh.profiles || []).map(p => ({ id: p.id, name: p.name, def: p.is_default, keys: Object.keys(p).join(',') })) };

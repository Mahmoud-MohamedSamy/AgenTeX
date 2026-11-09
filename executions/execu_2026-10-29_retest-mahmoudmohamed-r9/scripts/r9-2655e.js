// NDC-2655 cause: 24_7 sent WITH timing "same" + hours 09–17 → cleaned, refused, or stored? Then re-save unchanged. Restore the clean record.
const B = '/iam/tenant/business-hours'; const out = {};
const clean = { preset: '24_7', days_active: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], timing_mode: null, hours: null, hours_per_day: null, week_starts_on: 'sun', time_zone: 'Africa/Cairo', slots: null, slots_per_day: null };
try {
  const dirty = { ...clean, timing_mode: 'same', hours: { open: '09:00', close: '17:00' }, slots: [{ open: '09:00', close: '17:00' }] };
  const p = await api('o', 'PUT', B, dirty); out.putDirty = p.s + ' ' + (p.s > 299 ? p.t.slice(0, 220) : '');
  const g = (await api('o', 'GET', B)).j?.data; out.storedAfterDirty = JSON.stringify({ preset: g?.preset, timing: g?.timing_mode, hours: g?.hours, slots: g?.slots });
  const keep = Object.keys(clean); const again = Object.fromEntries(keep.map(k => [k, g?.[k] ?? null]));
  const r = await api('o', 'PUT', B, again); out.resaveUnchanged = r.s + ' ' + (r.s > 299 ? r.t.slice(0, 220) : '');
} finally { const rs = await api('o', 'PUT', B, clean); out.restore = rs.s; out.restored = JSON.stringify((await api('o', 'GET', B)).j?.data) === JSON.stringify(clean) || JSON.stringify((await api('o', 'GET', B)).j?.data).slice(0, 200); }
return out;

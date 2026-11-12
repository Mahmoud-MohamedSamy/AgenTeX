const mid = await modId(); const fs_ = await fieldsOf(mid); log('keys', Object.keys(fs_[0]).join(','));
const k = Object.keys(fs_[0]).find(x => /data_?type|field_?type|^type$|kind/i.test(x)); const by = {};
for (const f of fs_) { const t = f[k]; const c = f.capabilities && f.capabilities.canCreateValidationRule; (by[t] = by[t] || new Set()).add(String(c)); }
log(k, Object.entries(by).map(([t, s]) => t + ':' + [...s].join('/')).join('  '));

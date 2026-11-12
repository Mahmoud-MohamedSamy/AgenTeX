const mid = await modId(); const fs_ = await fieldsOf(mid);
log('fields', fs_.length, 'keys', Object.keys(fs_[0]).join(','));
log(fs_.map(f => f.apiName + ':' + f.datatypeKey + (f.capabilities && f.capabilities.canCreateValidationRule ? '+' : '-') + (f.isSystem ? 's' : '')).join(' '));
const L = await api('GET', '/modules/' + mid + '/layouts'); log('layouts', L.s, arr(L.j.data).map(l => l.id + '|' + l.name + '|' + (l.isDefault||l.is_default)).join(' ; '));
const R = await api('GET', '/modules/' + mid + '/records?limit=1'); log('rec', R.s, JSON.stringify(R.j).slice(0, 1500));

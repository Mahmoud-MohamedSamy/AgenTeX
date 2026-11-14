const r = await api('GET', `/modules/${TK}/blueprints`); log('bps', r.s, L(r.j?.data).map(b => (b.name||b.definition?.name) + '|' + b.isActive).join(' ; ').slice(0, 600));
log('made', JSON.stringify(made).slice(0, 400));

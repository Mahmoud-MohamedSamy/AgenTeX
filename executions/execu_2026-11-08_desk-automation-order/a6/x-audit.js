const all = L((await api('GET', `/modules/${TK}/blueprints?includeInactive=true`)).j?.data).map(b => b.definition?.name + '|' + b.isActive + '|' + b.in_progress_count); log(all.join(' ; '));

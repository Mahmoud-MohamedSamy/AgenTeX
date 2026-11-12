const g=(await api('GET','/scoring-rules/'+I.ruleG)).j.data; return {name:g&&g.name,active:g&&g.is_active,v:g&&g.row_version};

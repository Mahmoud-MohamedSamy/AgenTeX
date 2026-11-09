const ms = arr((await api('GET', '/modules')).j?.data).filter(m => /leads|deals|customers|contacts|agency/i.test(m.moduleKey)).map(m => ({ key: m.moduleKey, label: JSON.stringify(m.labels), singular: m.singularForm || m.singular_form || JSON.stringify(m.singularLabels || ''), plural: m.pluralForm }));
return done(ms);

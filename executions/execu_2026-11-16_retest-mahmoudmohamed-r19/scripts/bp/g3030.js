const g = await getBp('cca267b4-989c-47e8-8fa2-70b9d5935626'); return { rev: g.revision, name: g.definition.name, desc: g.definition.description, hasDraft: g.hasDraft, active: g.isActive };

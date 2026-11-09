const red = s => String(s).replace(/[\w.+-]+@[\w.-]+/g, '<email>');
return { skills: red((await api('GET', '/desk/skills')).t).slice(0, 1200), types: red((await api('GET', '/desk/skill-types')).t).slice(0, 400), agentSkills: red((await api('GET', '/desk/agent-skills')).t).slice(0, 900), prefs: red((await api('GET', '/desk/skill-preferences')).t).slice(0, 500) };

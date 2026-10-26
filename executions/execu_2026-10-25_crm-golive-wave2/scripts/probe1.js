const g = await call('GET', `/modules/${MODS.leads}/records/2f937b0e-82a4-4e40-ae43-17a6c78d4788`);
return { s: g.s, t: g.t.slice(0, 1500) };

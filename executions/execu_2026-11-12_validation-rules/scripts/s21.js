const mid = await modId(); const x = (await rules(mid)).find(r => r.name === P + ' I2 double'); if (x) await delRule(mid, x.id); return x ? 'deleted I2' : 'none';

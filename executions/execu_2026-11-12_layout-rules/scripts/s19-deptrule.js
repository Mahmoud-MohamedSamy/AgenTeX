const mid = await modId(); const CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';
const g = (await getRule(mid, I.r3)).j.data; const u = await putRule(mid, I.r3, { ...g, departmentIds: [CS] }); log('vip rule -> CS only', SR(u));
const g2 = (await getRule(mid, I.r3)).j.data; return { departmentIds: g2.departmentIds, applyToHelpCenter: g2.applyToHelpCenter };

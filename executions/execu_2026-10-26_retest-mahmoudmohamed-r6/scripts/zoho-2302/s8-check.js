// For each lead "QA RT 2302*": API blueprint status + record page screenshot. Usage: node run.js s8-check.js <tag>
module.exports = async ({ page, shot, log, api, gotoReady, args }) => {
  await gotoReady('https://crm.zoho.com/crm/org943261092/tab/Leads', /Create Lead/);
  const r = await api('GET', '/crm/v2.2/Leads/search?criteria=' + encodeURIComponent('(Last_Name:starts_with:QA RT 2302)'));
  log('SEARCH', r.status);
  const data = r.status === 200 ? JSON.parse(r.body).data : [];
  for (const L of data) {
    log('LEAD', L.id, L.Last_Name, 'Rating=', L.Rating, 'Created', L.Created_Time, '$process_flow=', L.$process_flow, '$in_merge', L.$in_merge, 'approval', JSON.stringify(L.$approval_state));
    const bp = await api('GET', `/crm/v2.2/Leads/${L.id}/actions/blueprint`);
    log('  BP API', bp.status, bp.body.slice(0, 700));
    await gotoReady(`https://crm.zoho.com/crm/org943261092/tab/Leads/${L.id}`, new RegExp(L.Last_Name));
    await page.waitForTimeout(4000);
    const slug = L.Last_Name.replace('QA RT 2302 ', '');
    await shot(`lead-${slug}-${args[0] || 'check'}`, { clip: { x: 0, y: 0, width: 1600, height: 420 } });
    const t = (await page.innerText('body')).replace(/\s+/g, ' ');
    log('  PAGE has "QA RT 2302 Go":', /QA RT 2302 Go/.test(t), '| has "Acquired":', /Acquired/.test(t), '| snippet:', t.slice(t.indexOf(L.Last_Name), t.indexOf(L.Last_Name) + 400));
  }
};

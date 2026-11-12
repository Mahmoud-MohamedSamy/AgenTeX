async (page, ctx) => {
  const p = await zdPage(ctx); const out = { url: p.url().replace(/\?.*/, '') };
  const lr = await zd(p, 'GET', '/layoutRules?departmentId=' + DEPT + '&module=tickets'); out.rules = lr.s + ' ' + lr.t.slice(0, 600);
  const ly = await zd(p, 'GET', '/layouts?module=tickets&departmentId=' + DEPT); out.layouts = ly.s + ' ' + JSON.stringify((ly.j?.data || []).map(l => ({ id: l.id, name: l.layoutName, def: l.isDefaultLayout }))).slice(0, 500);
  return out;
}

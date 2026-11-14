const PID = '4283701b-5654-4d3c-a168-7dd7a7860af4';
const b = (o) => ({ department_id: MK, name: 'QA GL W3 V', description: null, type: 'allowance', allowance: 2, cycle: 'monthly', carry_forward: false, allow_additional_usage: false, policy_id: PID, ...o });
const T = { a0: b({ allowance: 0 }), aneg: b({ allowance: -1 }), abig: b({ allowance: 100000 }), afrac: b({ allowance: 1.5 }), dup: b({ name: 'QA GL W3 Allowance' }), dupcase: b({ name: 'qa gl w3 allowance' }), long300: b({ name: 'QA GL W3 ' + 'x'.repeat(291) }), blank: b({ name: '   ' }), nopol: b({ policy_id: null }), badcycle: b({ cycle: 'daily' }), unlimWithAllow: b({ type: 'unlimited', allowance: 5, name: 'QA GL W3 V2' }), otherDeptPol: b({ department_id: '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', name: 'QA GL W3 V3' }) };
out.r = {};
for (const [k, v] of Object.entries(T)) { const r = await api('POST', '/desk/sla/support-plans', v); out.r[k] = r.s + ' ' + (r.j?.error ? JSON.stringify(r.j.error).slice(0, 220) : ''); const id = r.j?.data?.id; if (id) { CREATED.push({ kind: 'support_plan', id, name: v.name.slice(0, 40) }); out.r[k] += ' saved allowance=' + r.j.data.allowance + ' type=' + r.j.data.type; } }
// screen: allowance 0 and 100000 messages
await go('/settings/automation/support-plans?department=' + MK, 9000); await page.getByRole('button', { name: /New Plan/i }).first().click(); await sleep(3000);
const dlg = page.locator('[role=dialog]').last(); await dlg.locator('input').first().fill('QA GL W3 V screen');
await dlg.getByRole('button', { name: 'SLA policy' }).click(); await sleep(1000); await page.getByRole('option', { name: 'QA GL W3 SLA' }).first().click().catch(() => page.getByText('QA GL W3 SLA').last().click()); await sleep(600);
for (const v of ['0', '100000']) { await dlg.locator('input[type=number]').fill(v); await dlg.getByRole('button', { name: 'Save' }).click(); await sleep(3000);
  out['ui_' + v] = { open: await dlg.count(), toast: (await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 300), field: (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(300, 700) }; await shot('w3/W3-04-allow-' + v); if (!(await dlg.count())) break; }
await page.keyboard.press('Escape');
const l = await api('GET', '/desk/sla/support-plans?department_id=' + MK); out.after = (D(l.j) || []).map(p => p.id + ' ' + p.name.slice(0, 30) + ' ' + p.allowance); 
return fin({ out });

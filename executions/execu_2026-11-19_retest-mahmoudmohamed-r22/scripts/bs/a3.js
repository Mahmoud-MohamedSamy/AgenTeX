const CON = '0924eb24-e42a-4eab-8efd-e3428f19e882'; const R = JSON.parse(fs.readFileSync('bs/2841.json', 'utf8'));
const g = (await api('GET', '/modules/' + CON + '/records/' + R.ids.c3id)).j?.data?.data || [];
const v = k => g.find(z => z.field === k)?.value?.value;
const ui = (await api('GET', '/modules/' + CON + '/records/562e9bee-fdac-4b80-8d76-821f963858b6')).j?.data?.data || [];
const cu = await api('GET', '/desk/sla/contracts/562e9bee-fdac-4b80-8d76-821f963858b6/coverage');
return { c3_plan_is_A: v('support_plan') === R.ids.planA, c3_dept_is_B: v('department') === '09b9df1d-2345-44c5-9e4e-6778e219fd7e', ui_plan_is_B: ui.find(z => z.field === 'support_plan')?.value?.value === R.ids.planB, ui_cov: cu.j?.data?.plan?.name };

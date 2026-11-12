const l = arr(D((await api('GET', '/web-forms')).j));
out.list = l.map(f => f.id + ' | ' + f.kind + ' | ' + f.name + ' | ' + f.department_id + ' | enabled=' + f.is_enabled);
out.one = JSON.stringify(l.find(f => f.kind === 'advanced_form')).slice(0, 2500);
out.fw = JSON.stringify(l.find(f => f.kind !== 'advanced_form')).slice(0, 1500);
await go('/settings/channels/web-forms', 10000);
await page.getByRole('button', { name: /^New feedback widget/ }).click(); await sleep(3000);
out.fwPage = page.url() + ' :: ' + ((await page.locator('[role=dialog]').last().innerText().catch(() => null)) || (await txt())).replace(/\s+/g, ' ').slice(-1500);
await shot('w4/W4-32-new-widget');
return fin({ out });

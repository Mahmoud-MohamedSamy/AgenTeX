// W5-39 export contacts filtered to QA GL W5 (CSV)
await go('/settings/data/export', 12000);
const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); out.page = t.slice(t.indexOf('Email Providers') + 15, t.indexOf('Email Providers') + 1200);
out.ctl = await page.locator('main').last().locator('button, select, input').evaluateAll(es => es.map(e => e.tagName + ':' + (e.getAttribute('aria-label') || e.innerText || e.placeholder || '').trim().slice(0, 30)).filter(x => !/^BUTTON:(GENERAL|USER|CHANNELS|SELF|CUSTOM|AUTOM|DATA|COLLAB|INTEGR|Two-F|Company|Products|Departments|Business|Holidays|Customer Happ|Rebrand|Signals|Agents|Teams|Data Sh|Roles|Profiles|Ticket Acc|Help w|Modules|Data T|Capab|Organize|Email|Notif|Ticket N|Ticket T|Skills|Home|Recycle|Export|Import|Bulk|Data B|Migr|Data R|Sandb|Data A|Audit|Collab|Custom A|CRM)/.test(x)).slice(0, 30));
await shot('w5/W5-39-export');
return fin({ out });

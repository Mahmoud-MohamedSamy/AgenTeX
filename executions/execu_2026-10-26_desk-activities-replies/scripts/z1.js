await go('/activities/list', 12000);
out.url = page.url(); out.text = (await txt()).slice(0, 3000); out.shot = await shot('activities-list');

await go('/settings/channels/help-center/rebranding', 14000);
const t = (await txt()).replace(/\s+/g, ' '); out.state = (t.match(/.{0,80}(Published|Draft|publish)[^.]{0,160}/gi) || []).slice(0, 4);
out.btns = (await page.locator('button').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(-16);
out.name = await page.locator('#help-center-name').inputValue();
return fin({ out });

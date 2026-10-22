const dlp = page.waitForEvent('download', { timeout: 20000 }).catch(e => null);
await page.getByRole('menuitem', { name: 'Download error rows' }).click();
const dl = await dlp; let saved = null;
if (dl) { saved = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-21_retest-mahmoudmohamed/files/downloaded-error-rows-' + dl.suggestedFilename(); await dl.saveAs(saved); }
await sleep(1500);
const toasts = await page.locator('[data-sonner-toast]').allInnerTexts();
return done({ got: !!dl, name: dl && dl.suggestedFilename(), saved, toasts });

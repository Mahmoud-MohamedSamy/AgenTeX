async (page) => {
  await page.locator('button:has-text("Update"), [role=button]:has-text("Update")').first().click(); await page.waitForTimeout(2500);
  await page.screenshot({path:'evidence/zoho-w5/z-e1-dialog.png'});
  const dlg = page.locator('[role=dialog], [class*=ialog], [class*=opup], [class*=ormContainer]').last();
  return (await page.innerText('body')).slice(-1500).replace(/\s+/g,' ');
}

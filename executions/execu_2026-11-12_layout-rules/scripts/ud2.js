async (page) => {
  await page.goto(HOST + '/settings/help-center', { waitUntil: 'domcontentloaded' }); await sleep(7000);
  const t = await bodyText(); const urls = [...new Set((await page.content()).match(/https?:\/\/[a-z0-9.-]+\.[a-z]{2,}[a-zA-Z0-9\/._?=-]*/g) || [])].filter(u => !/googleapis|gstatic|w3\.org|lucide/.test(u)).slice(0, 15);
  return { url: page.url(), t: t.slice(0, 1200), urls };
}

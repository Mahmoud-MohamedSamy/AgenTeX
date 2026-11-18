async (page) => ({ url: page.url(), title: await page.title() })

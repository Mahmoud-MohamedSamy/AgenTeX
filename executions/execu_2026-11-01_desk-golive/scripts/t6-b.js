await go('/views/all/tickets/' + T1, 9000);
const m = await openMore(); out.items = await m.getByRole('menuitem').allInnerTexts();
out.aria = await m.getByRole('menuitem').evaluateAll(es => es.map(e => (e.getAttribute('aria-disabled') || '') + (e.getAttribute('data-disabled') !== null ? 'D' : '')));
await shot('tm/tavi-more');
return fin({ out });

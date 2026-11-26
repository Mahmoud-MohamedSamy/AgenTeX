const I2 = JSON.parse(fs.readFileSync(RUN + '/out/p3-ids.json', 'utf8')); const o = {};
for (const [k, q] of [['B-08', 'Change the lead source of the lead "QA TIA P3 B08" to Referral.']]) {
  const x = await askCard(q); I2[k] = { action: x.acts[0]?.id || null, text: x.text.slice(0, 200) }; o[k] = { card: x.card, text: x.text.slice(0, 160) };
}
fs.writeFileSync(RUN + '/out/p3-ids.json', JSON.stringify(I2, null, 1)); return o;

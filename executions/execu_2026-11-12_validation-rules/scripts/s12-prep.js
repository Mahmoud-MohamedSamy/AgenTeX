const mid = await modId(); const L = I.layout;
const a = await mkRule(mid, { name: P + ' B6 delete me', layoutId: L, primaryField: 'qa_vr_long', branches: [B(C('eq', 'qa_vr_long', 7), 'QA B6')] });
const b = await mkRule(mid, { name: P + ' K1 <b>bold</b><img src=x onerror=alert(11)>', layoutId: L, primaryField: 'qa_vr_ml', branches: [{ when: null, check: C('contains', 'qa_vr_ml', 'xss'), message: { en: '<img src=x onerror=alert(12)><b>QA K1 bold?</b>', ar: '<script>alert(13)</script>' }, triggerOn: 'match' }] });
return { b6: SR(a).slice(0, 100), k1: SR(b).slice(0, 200) };

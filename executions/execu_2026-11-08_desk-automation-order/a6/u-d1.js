await go('/settings/security/audit-log'); await sleep(10000);
await shot('d1-tavi-auditlog');
return { ok: true };

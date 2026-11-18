const R4 = '6c305f58-fc4d-435a-a59b-9931d7b4829d';
out.re = (await api('POST', '/desk/sla/policies/8718a2bd-2ff0-4621-ab43-e707d25ddd06/reapply-open', {})).t.slice(0, 200);
await sleep(5000); const s = await api('GET', '/desk/tickets/' + R4 + '/sla'); out.sla = s.t.slice(0, 500);
return fin({ out });

const o = {}; const T2 = '5c68004d-860c-4bcd-b6b8-77e0bce5c044', T3 = '7bec7744-755c-48bc-932f-6d3d5ce2191f';
o.n2 = (await rec(T2)).ticket_number; o.n3 = (await rec(T3)).ticket_number;
o.run = E(await runT(T3, 'urgent', 'Open')); await sleep(3000); o.t3 = (await bstate(T3))?.activeStates;
LED('ticket ' + T3 + ' #' + o.n3 + ' moved Open -> On Hold by owner (QA urgent): ' + o.run + '; t2 is #' + o.n2);
return o;

// NDC-1873 step 1: drop a new Lookup and read the properties panel.
await drag('Lookup', 800, 560);
await shot('1873-01-lookup-dropped');
return done({ panel: await panelText(), inputs: await inputsIn() });

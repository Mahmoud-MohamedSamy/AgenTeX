const M = made.mod, LID = made.layouts[0]; const lay = (await api('GET', `/modules/${M}/layouts/${LID}`)).j.data;
const body = { name: lay.name, views: lay.views, assignedProfiles: lay.assignedProfiles, status: lay.status, accessMode: lay.accessMode, rowVersion: lay.rowVersion, description: lay.description };
const r = await api('PUT', `/modules/${M}/layouts/${LID}`, body); log('layout re-save unchanged', E(r));

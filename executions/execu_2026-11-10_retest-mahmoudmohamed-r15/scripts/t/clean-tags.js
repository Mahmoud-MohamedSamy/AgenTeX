const res = [];
for (const id of ['fbaca6d3-3066-4f54-83cb-cb0e1142e5ee','bd3bb0f0-5f70-40bf-ac37-ea5d696d4edb','78442974-12ff-4f43-b387-648e20c45580','faf8fcdd-8fc5-4c34-8ff2-919a7dde49cb','1c46f022-0411-4a1e-aa32-be360d2073a2','5e36ecf8-3cd8-46fc-9ba7-3a0112c39997']) {
  let r = await api('DELETE', `/desk/tags/${id}?confirm=true`); if (r.s >= 300) r = await api('DELETE', `/desk/tags/${id}?force=true`); res.push(id.slice(0, 8) + ' ' + r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 200) : ''));
}
return res;

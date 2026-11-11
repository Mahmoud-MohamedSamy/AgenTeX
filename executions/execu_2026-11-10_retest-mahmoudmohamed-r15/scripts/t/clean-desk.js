const M = { T: '88e8ea44-1658-4df3-9930-d0902b91073d', C: '43004ce2-577f-4eda-b00a-0750fe40c3d4', K: 'd120a6c2-2596-4254-968b-a1bcd3a000bf', L: 'f7e488b5-0232-42fd-811c-1f24356af653' };
const res = [];
const del = async (label, p) => { const r = await api('DELETE', p); res.push(label + ' ' + r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 120) : '')); };
for (const id of ['2d549710-0315-482b-9cf7-d59dff48f1c1','e256b2d6-1ce7-4f32-9158-5febbcb78359','35d7f733-8b6c-461a-9121-fc5398d63ace','5ccaada8-4e85-46e1-8b68-bf8e1b35d079','3c16f84a-110a-4ffd-b90c-2dc16ceb8b49']) { await api('POST', `/workflow/rules/${id}/deactivate`); await del('rule ' + id.slice(0, 8), `/workflow/rules/${id}`); }
for (const id of ['9e69beb4-fc78-4566-b010-52b3405e7bd8','f8d1cdba-7e1d-4a82-9516-7d78fb050c11']) await del('sla ' + id.slice(0, 8), `/desk/sla/policies/${id}`);
for (const id of ['0178971d-eef5-4677-8244-e6167f017475','6fa16838-7a44-4fdc-a330-8cc9654598c8']) await del('task ' + id.slice(0, 8), `/modules/${M.K}/records/${id}`);
await del('call 4e7d40ae', `/modules/${M.L}/records/4e7d40ae-7e76-4ad2-816f-a90914742de0`);
for (const id of ['a9bfd0be-ff18-48d3-b3a3-a0677184220d','1f8e6e33-174e-4065-872c-9e2f82f70d2d','76c9b940-4734-4305-8277-f98956666ae7','797d66ea-d04d-4e53-9a05-5df091e3f42d','456b698a-8335-47fa-9fc4-829803ca8d8d','b242d6b2-6836-4360-9463-3dcdb639e048','db3b9750-8f10-456d-9fca-9e5eff884f0e','e6603b06-c2b6-43d3-9446-c322e9e822c0','eb49b4a1-69e0-4785-bba7-c3893c3e1e6c','984042a6-88f4-4106-9796-625447000903','5874e14a-7ac8-4e67-848d-84c0772bc585','e69a02f6-6d8a-4d59-b14e-ffa48a5263b6','2c82e0b1-92e9-4448-b47e-8d099c3024d9','d4214987-27fa-4856-a808-b46155b879ad']) await del('ticket ' + id.slice(0, 8), `/modules/${M.T}/records/${id}`);
for (const id of ['0aafc57d-893b-4f34-ae4b-3e18f31f4d32','4a8fbdbb-42be-43be-b667-332fddcee4b9']) await del('contact ' + id.slice(0, 8), `/modules/${M.C}/records/${id}`);
for (const id of ['fbaca6d3-3066-4f54-83cb-cb0e1142e5ee','bd3bb0f0-5f70-40bf-ac37-ea5d696d4edb','78442974-12ff-4f43-b387-648e20c45580','faf8fcdd-8fc5-4c34-8ff2-919a7dde49cb','1c46f022-0411-4a1e-aa32-be360d2073a2','5e36ecf8-3cd8-46fc-9ba7-3a0112c39997']) await del('tag ' + id.slice(0, 8), `/desk/tags/${id}`);
await del('team a0005a2a', '/desk/teams/a0005a2a-de98-4c1a-9cef-039a5b4ce452');
return res;

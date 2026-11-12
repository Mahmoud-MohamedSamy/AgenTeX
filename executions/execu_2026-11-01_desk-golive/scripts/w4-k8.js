const CR = '2dda6133-f8ba-40e3-842e-a43d09faf9a5', B = '3445ec4a-020e-4f12-b156-dd2de7610164';
const cats = D((await api('GET', '/desk/kb/categories')).j).categories; const c = cats.find(x => x.id === CR);
let r = await api('PUT', '/desk/kb/categories/' + CR, { name: c.name, description: c.description, department_id: c.department_id, image_file_id: null, hidden_from_help_center: false, sort_order: c.sort_order, shared_department_ids: [], review_required: true, reviewer_user_ids: [B] });
out.putCat = r.s + ' ' + r.t.slice(0, 200);
if (r.s >= 400) { r = await api('PATCH', '/desk/kb/categories/' + CR, { reviewer_user_ids: [B] }); out.patchCat = r.s + ' ' + r.t.slice(0, 200); }
r = await api('POST', '/desk/kb/articles', { title: 'QA GL W4 review article', body_html: '<p>QA GL W4 needs review. Search word: okapi88.</p>', category_id: CR, visibility: 'all_users' });
const id = r.j && r.j.data && r.j.data.id; out.create = r.s; if (id) CREATED.push({ kind: 'kb-article', id, name: 'QA GL W4 review article' });
r = await api('POST', '/desk/kb/articles/' + id + '/publish', {}); out.publish = r.s + ' ' + r.t.slice(0, 300);
const a = D((await api('GET', '/desk/kb/articles/' + id)).j); out.state = a.status + ' review_requested_at=' + a.review_requested_at + ' published_at=' + a.published_at;
out.id = id;
return fin({ out });

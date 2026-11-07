const o = {}; const S = '8598242d-f167-4a4f-9b0b-3ee189c13601', C = 'ced93d6d-0109-443b-8fb4-6ffa9ccdbcd8';
const first = async (id, path, bodies) => { let last; for (const b of bodies) { const r = await api('o', 'POST', `desk:/desk/tickets/${id}/${path}`, b); last = X.err(r) + ' ' + JSON.stringify(Object.keys(b)); if (r.s !== 400) return { r: last, id: r.j?.data?.id }; } return { r: last }; };
const tagB = [{ names: ['qa-rt12-2754'] }, { tag_names: ['qa-rt12-2754'] }, { tags: [{ name: 'qa-rt12-2754' }] }, { name: 'qa-rt12-2754' }];
const comB = [{ body: 'QA RT12 2754 comment', is_public: false }, { body_html: '<p>QA RT12 2754 comment</p>', is_public: false }, { content_html: '<p>QA RT12 2754 comment</p>', visibility: 'private' }];
const repB = [{ subject: 'QA RT12 2754 reply', body_html: '<p>QA</p>', to: ['qa.rt12@example.com'], cc: [], bcc: [], send: false, is_draft: true }];
for (const [k, id] of [['control', C], ['strict', S]]) { o[k] = { tag: (await first(id, 'tags', tagB)).r, comment: (await first(id, 'comments', comB)), reply: (await first(id, 'replies', repB)).r }; }
// delete the control comment again if created; try deleting a comment on the strict ticket is not possible (none can be added)
if (o.control.comment.id) o.controlCommentDelete = X.err(await api('o', 'DELETE', `desk:/desk/tickets/${C}/comments/${o.control.comment.id}`));
return o;

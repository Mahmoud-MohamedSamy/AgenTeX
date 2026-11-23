const id=made.tickets[made.tickets.length-4];const g=(await api('GET','/modules/'+TK+'/records/'+id)).j?.data;return {created_with_layout_id:g.created_with_layout_id};

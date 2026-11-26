return E(await api.O('PUT', '/desk/tickets/parent-child/settings', { parent_close_behavior: 'block_while_children_open', auto_close_parent: true }));

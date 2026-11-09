return { u1: (await api('o', 'GET', `/iam/users/${T.U1}/overrides`)).t.slice(0, 300) };

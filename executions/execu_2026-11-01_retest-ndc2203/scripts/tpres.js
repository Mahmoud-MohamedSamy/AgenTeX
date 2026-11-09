return { me: (await api('GET', '/iam/me')).j?.data?.user_id, presence: (await api('GET', '/desk/agents/me/presence')).t.slice(0, 600) };

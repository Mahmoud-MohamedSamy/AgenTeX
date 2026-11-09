return {me:(await api('GET','/desk/agents/me/presence')).t.slice(0,800)}

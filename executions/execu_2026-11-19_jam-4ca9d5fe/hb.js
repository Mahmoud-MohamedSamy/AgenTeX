const hb = await api('POST', '/desk/agents/me/presence/heartbeat', {}); log({ hb: hb.s, online: hb.j?.data?.online, email: hb.j?.data?.channels?.email });

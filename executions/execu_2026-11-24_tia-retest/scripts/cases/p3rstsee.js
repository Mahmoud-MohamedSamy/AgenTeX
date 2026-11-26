const o={};for(const k of ['t1','t2','tOther']){o[k]=(await api('GET',`/modules/${M.tickets}/records/${P3I[k]}`)).s}return o;

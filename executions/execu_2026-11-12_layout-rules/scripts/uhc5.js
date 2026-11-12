async (page) => { return (page.__hc.__last || '').replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g, '<email>').slice(0, 2000); }

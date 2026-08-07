// Prefixos de query key usados para invalidar caches entre features. O
// TanStack Query casa por prefixo, então invalidar `["notifications"]`
// alcança `["notifications", profileId]` de qualquer perfil em cache.

export const notificationsRefreshKey = ["notifications"] as const;
export const conversationsRefreshKey = ["conversations"] as const;
export const proposalsRefreshKey = ["proposals"] as const;
export const apartmentsRefreshKey = ["apartments"] as const;

import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Data now comes from Postgres (sa-east-1) instead of an in-memory mock,
    // so preloading on every link hover at staleTime 0 would refetch across
    // the network each time. Individual queries still set their own
    // staleTime; this only changes the preload-on-hover default.
    defaultPreloadStaleTime: 30_000,
  });

  return router;
};

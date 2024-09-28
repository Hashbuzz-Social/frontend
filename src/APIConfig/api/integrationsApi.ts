import useDebounncedRequests from "../hooks/useDebouncedRequest";

export const useIntegrationsApi = () => {
  const { isLoading, get } = useDebounncedRequests();

  const Integrations = {
    twitterPersonalHandle: (): Promise<{ url: string }> =>
      get<{ url: string }>("/api/integrations/twitter/personalHandle").then((response) => {
        if (!response) {
          throw new Error("Failed to fetch twitter personal handle");
        }
        return response;
      }),
    twitterBizHandle: (): Promise<{ url: string }> =>
      get<{ url: string }>("/api/integrations/twitter/bizHandle").then((response) => {
        if (!response) {
          throw new Error("Failed to fetch twitter business handle");
        }
        return response;
      }),
  };

  return { isLoading, ...Integrations };
};

export default useIntegrationsApi;

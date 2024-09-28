import useDebounncedRequests from "../hooks/useDebouncedRequest";
import { addCampaignBody, CampaignCards, updateCampaignStatusBody } from "../../types";

export const useCampaignApi = () => {
  const { isLoading, get, post } = useDebounncedRequests();

  const Campaign = {
    addCampaign: (data: addCampaignBody): Promise<any> => post("/api/campaign/add-new", { ...data }),
    getCampaigns: (): Promise<CampaignCards[]> =>
      get<CampaignCards[]>("/api/campaign/all").then((response) => {
        if (!response) {
          throw new Error("Failed to fetch campaigns");
        }
        return response;
      }),
    updateCampaignStatus: (data: updateCampaignStatusBody): Promise<any> => post("/api/campaign/update-status", { ...data }),
    chatResponse: (data: any): Promise<any> => post("/api/campaign/chatgpt", data),
  };

  return { isLoading, ...Campaign };
};

export default useCampaignApi;

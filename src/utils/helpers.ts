import { EntityBalances, user_roles } from "../types";
export const NETWORK = process.env.REACT_APP_NETWORK ?? "testnet";
export const dAppApiURL = process.env.REACT_APP_DAPP_API;

export enum CampaignStatus {
  ApprovalPending = "ApprovalPending",
  CampaignApproved = "CampaignApproved",
  CampaignDeclined = "CampaignDeclined",
  CampaignStarted = "CampaignStarted",
  CampaignRunning = "CampaignRunning",
  RewardDistributionInProgress = "RewardDistributionInProgress",
  RewardsDistributed = "RewardsDistributed",
  InternalError = "InternalError",
}

export const CampaignStatusTexts = {
  [CampaignStatus.ApprovalPending]: "Approval Pending",
  [CampaignStatus.CampaignApproved]: "Campaign Approved",
  [CampaignStatus.CampaignDeclined]: "Campaign Declined",
  [CampaignStatus.CampaignStarted]: "Campaign Started",
  [CampaignStatus.CampaignRunning]: "Campaign Running",
  [CampaignStatus.RewardDistributionInProgress]: "Reward Distribution In Progress",
  [CampaignStatus.RewardsDistributed]: "Rewards Distributed",
  [CampaignStatus.InternalError]: "Internal Error",
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// const _delete_cookie = (name: string) => {
//   document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
// };

export const getErrorMessage = (err: any) => {
  if (err?.response?.data) return err?.response?.data?.error?.description ?? err?.response?.data.message;
  if (err?.message) return err?.message;
  return "Server response error";
};

export const isAnyBalancesIsAvailable = (entities: EntityBalances[]): boolean => {
  let isAvailable = false;
  for (let i = 0; i < entities.length; i++) {
    const element = entities[i];
    if (parseFloat(element.entityBalance) > 0) {
      isAvailable = true;
      break;
    }
  }
  return isAvailable;
};

export const isAllowedToCmapigner = (role?: user_roles): boolean => {
  if (!role) return false;
  return ["USER", "ADMIN", "SUPER_ADMIN"].includes(role);
};

export const getCardStausText = (value: CampaignStatus) => CampaignStatusTexts[value];

export const getCardStatusFromStatusText = (statusText: string): keyof typeof CampaignStatusTexts | undefined => {
  console.log({ statusText });
  // Find the key corresponding to the given statusText
  const entry = Object.entries(CampaignStatusTexts).find(([_, text]) => text === statusText);

  // If entry is found, return the key
  if (entry) {
    return entry[0] as keyof typeof CampaignStatusTexts;
  }

  // If no matching text is found, return undefined or handle the error as needed
  return undefined;
};

export const getSymbol = (entities: EntityBalances[], entityId: string) => {
  const icon = entities.find((entity) => entity.entityId === entityId)?.entityIcon;
  return icon;
}

/**
 * Get the last item from an array
 * @param array - The array from which to retrieve the last item
 * @returns The last item in the array, or undefined if the array is empty
 */
export const getLastItem = <T>(array: T[]): T | undefined => {
  if (array.length === 0) return undefined;
  return array[array.length - 1];
};

export const calculateDimensions = ({ originalDimensions, newWidth, newHeight }: { originalDimensions: { width: number, height: number }; newWidth?: number; newHeight?: number }) => {
  if (newWidth && newHeight) {
    return { width: newWidth, height: newHeight };
  }
  if (newWidth) {
    return { width: newWidth, height: (newWidth * originalDimensions.height) / originalDimensions.width };
  }
  if (newHeight) {
    return { width: (newHeight * originalDimensions.width) / originalDimensions.height, height: newHeight };
  }
  return originalDimensions;
};


export const getCookieByName = (name: string): string | null => {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) => c.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}


export const getCookie = (cname: string) => {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

import { apiBase } from './apiBase'
import type { CampaignCards } from '../types/campaign'

export interface CreateCampaignRequest {
  name: string
  tweet_text: string
  comment_reward: string
  retweet_reward: string
  like_reward: string
  quote_reward: string
  follow_reward: string
  campaign_budget: string
  type: 'HBAR' | 'FUNGIBLE'
  fungible_token_id?: string
  media?: File[]
}

export interface CreateCampaignResponse {
  success: boolean
  data: CampaignCards
  message?: string
}

export interface UpdateCampaignStatusRequest {
  card_id: number
  campaign_command: string
}

export interface CampaignStatsRequest {
  card_id: number
}

export interface CampaignBalanceRequest {
  campaignId: number
}

export interface ChatGPTRequest {
  message: string
}

/**
 * Campaign API endpoints for campaign management operations.
 */
export const campaignApi = apiBase.injectEndpoints({
  endpoints: builder => ({
    // Get all campaigns for current user
    getCampaigns: builder.query<CampaignCards[], void>({
      query: () => '/api/campaign/all',
    }),

    // Create new campaign with file upload support
    createCampaign: builder.mutation<CreateCampaignResponse, FormData>({
      query: (formData) => ({
        url: '/api/campaign/add-new',
        method: 'POST',
        body: formData,
      }),
    }),

    // Update campaign status (start, pause, etc.)
    updateCampaignStatus: builder.mutation<any, UpdateCampaignStatusRequest>({
      query: body => ({
        url: '/api/campaign/update-status',
        method: 'POST',
        body,
      }),
    }),

    // Get campaign statistics
    getCampaignStats: builder.mutation<any, CampaignStatsRequest>({
      query: body => ({
        url: '/api/campaign/stats',
        method: 'POST',
        body,
      }),
    }),

    // Check campaign balance
    getCampaignBalance: builder.query<{ balance: number }, number>({
      query: (campaignId) => ({
        url: '/api/campaign/balance',
        params: { campaignId },
      }),
    }),

    // Get card engagement status
    getCardEngagement: builder.query<any, number>({
      query: (id) => ({
        url: '/api/campaign/card-status',
        params: { id },
      }),
    }),

    // Get reward details
    getRewardDetails: builder.query<any, void>({
      query: () => '/api/campaign/reward-details',
    }),

    // Claim rewards
    claimRewards: builder.mutation<any, any>({
      query: body => ({
        url: '/api/campaign/claim-reward',
        method: 'PUT',
        body,
      }),
    }),

    // Chat with OpenAI
    chatWithAI: builder.mutation<any, ChatGPTRequest>({
      query: body => ({
        url: '/api/campaign/chatgpt',
        method: 'POST',
        body,
        params: { message: body.message },
      }),
    }),

    // Upload media
    uploadMedia: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/api/campaign/add-media',
        method: 'POST',
        body: formData,
      }),
    }),

    // Get recent tweets
    getRecentTweets: builder.query<any, void>({
      query: () => '/api/campaign/recent-tweets',
    }),

  }),
  overrideExisting: false,
})

// Export hooks for usage in React components
export const {
  useGetCampaignsQuery,
  useLazyGetCampaignsQuery,
  useCreateCampaignMutation,
  useUpdateCampaignStatusMutation,
  useGetCampaignStatsMutation,
  useGetCampaignBalanceQuery,
  useLazyGetCampaignBalanceQuery,
  useGetCardEngagementQuery,
  useLazyGetCardEngagementQuery,
  useGetRewardDetailsQuery,
  useClaimRewardsMutation,
  useChatWithAIMutation,
  useUploadMediaMutation,
  useGetRecentTweetsQuery,
} = campaignApi

export default campaignApi

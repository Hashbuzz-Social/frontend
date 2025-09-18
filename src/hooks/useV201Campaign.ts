import {
  useCreateCampaignDraftV201Mutation,
  usePublishCampaignV201Mutation,
} from '@/API/campaign';
import { useGetTokenBalancesQuery } from '@/API/user';
import { TokenBalances } from '@/types';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// V201 Campaign form data structure
export interface V201CampaignFormData {
  name: string;
  tweet_text: string;
  expected_engaged_users: number;
  campaign_budget: number;
  type: 'HBAR' | 'FUNGIBLE';
  media: File[];
  fungible_token_id?: string;
}

// Form validation errors
export interface V201CampaignErrors {
  name?: string;
  tweet_text?: string;
  expected_engaged_users?: string;
  campaign_budget?: string;
  fungible_token_id?: string;
  media?: string;
}

// Hook return type
export interface UseV201CampaignReturn {
  // Form state
  formData: V201CampaignFormData;
  setFormData: React.Dispatch<React.SetStateAction<V201CampaignFormData>>;
  errors: V201CampaignErrors;

  // API state
  isDraftLoading: boolean;
  isPublishLoading: boolean;
  isLoading: boolean;
  savedDraftId: string | null;

  // Token data
  tokenBalances: TokenBalances[] | undefined;
  isLoadingTokens: boolean;

  // Actions
  handleFieldChange: (
    field: keyof V201CampaignFormData
  ) => (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { value: string } }
  ) => void;
  handleMediaUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeMediaFile: (index: number) => void;
  validateForm: () => boolean;
  saveDraft: () => Promise<void>;
  publishCampaign: () => Promise<void>;
  resetForm: () => void;

  // User balance for the selected token type
  getUserBalance: () => number;
  getMaxBudget: () => number;
}

// Initial form state
const initialFormData: V201CampaignFormData = {
  name: '',
  tweet_text: '',
  expected_engaged_users: 100,
  campaign_budget: 0,
  type: 'HBAR',
  media: [],
  fungible_token_id: '',
};

export const useV201Campaign = (): UseV201CampaignReturn => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] =
    useState<V201CampaignFormData>(initialFormData);
  const [errors, setErrors] = useState<V201CampaignErrors>({});
  const [savedDraftId, setSavedDraftId] = useState<string | null>(null);

  // API hooks
  const [createDraft, { isLoading: isDraftLoading }] =
    useCreateCampaignDraftV201Mutation();
  const [publishCampaignMutation, { isLoading: isPublishLoading }] =
    usePublishCampaignV201Mutation();
  const { data: tokenBalances, isLoading: isLoadingTokens } =
    useGetTokenBalancesQuery();

  const isLoading = isDraftLoading || isPublishLoading;

  // Get user balance for current type
  const getUserBalance = useCallback((): number => {
    if (formData.type === 'HBAR') {
      // Find HBAR balance
      const hbarToken = tokenBalances?.find(
        token => token.token_id === 'HBAR' || token.token_symbol === 'HBAR'
      );
      return hbarToken?.available_balance || 0;
    } else if (formData.fungible_token_id) {
      // Find selected fungible token balance
      const selectedToken = tokenBalances?.find(
        token => token.token_id === formData.fungible_token_id
      );
      return selectedToken?.available_balance || 0;
    }
    return 0;
  }, [formData.type, formData.fungible_token_id, tokenBalances]);

  // Get maximum budget user can set (80% of available balance for safety)
  const getMaxBudget = useCallback((): number => {
    const balance = getUserBalance();
    return Math.floor(balance * 0.8); // Reserve 20% for fees and safety
  }, [getUserBalance]);

  // Handle field changes with type safety
  const handleFieldChange = useCallback(
    (field: keyof V201CampaignFormData) =>
      (
        event:
          | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          | { target: { value: string } }
      ) => {
        const value = event.target.value;

        setFormData(prev => ({
          ...prev,
          [field]:
            field === 'expected_engaged_users' || field === 'campaign_budget'
              ? Number(value) || 0
              : value,
        }));

        // Clear error when user starts typing
        if (field in errors && errors[field as keyof V201CampaignErrors]) {
          setErrors(prev => ({ ...prev, [field]: undefined }));
        }
      },
    [errors]
  );

  // Handle media file uploads
  const handleMediaUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const fileArray = Array.from(files);

        // Validate file sizes (max 10MB per file)
        const maxSize = 10 * 1024 * 1024; // 10MB
        const oversizedFiles = fileArray.filter(file => file.size > maxSize);

        if (oversizedFiles.length > 0) {
          setErrors(prev => ({
            ...prev,
            media: `Some files exceed the 10MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`,
          }));
          return;
        }

        // Validate file types (images and videos)
        const allowedTypes = ['image/', 'video/'];
        const invalidFiles = fileArray.filter(
          file => !allowedTypes.some(type => file.type.startsWith(type))
        );

        if (invalidFiles.length > 0) {
          setErrors(prev => ({
            ...prev,
            media: `Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}. Only images and videos are allowed.`,
          }));
          return;
        }

        setFormData(prev => ({
          ...prev,
          media: fileArray,
        }));

        // Clear media error if valid files selected
        if (errors.media) {
          setErrors(prev => ({ ...prev, media: undefined }));
        }
      }
    },
    [errors.media]
  );

  // Remove media file by index
  const removeMediaFile = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  }, []);

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: V201CampaignErrors = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Campaign name must be at least 3 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Campaign name must not exceed 50 characters';
    }

    if (!formData.tweet_text.trim()) {
      newErrors.tweet_text = 'Tweet text is required';
    } else if (formData.tweet_text.length < 10) {
      newErrors.tweet_text = 'Tweet text must be at least 10 characters';
    } else if (formData.tweet_text.length > 280) {
      newErrors.tweet_text = 'Tweet text must not exceed 280 characters';
    }

    // Expected engaged users validation
    if (formData.expected_engaged_users < 1) {
      newErrors.expected_engaged_users =
        'Expected engaged users must be at least 1';
    } else if (formData.expected_engaged_users > 1000000) {
      newErrors.expected_engaged_users =
        'Expected engaged users cannot exceed 1,000,000';
    }

    // Budget validation
    if (formData.campaign_budget <= 0) {
      newErrors.campaign_budget = 'Campaign budget must be greater than 0';
    } else {
      const userBalance = getUserBalance();
      const maxBudget = getMaxBudget();

      if (formData.campaign_budget > userBalance) {
        newErrors.campaign_budget = `Budget cannot exceed your ${formData.type === 'HBAR' ? 'HBAR' : 'token'} balance: ${userBalance}`;
      } else if (formData.campaign_budget > maxBudget) {
        newErrors.campaign_budget = `For safety, budget should not exceed ${maxBudget} (80% of available balance)`;
      }
    }

    // Token validation for FUNGIBLE type
    if (formData.type === 'FUNGIBLE' && !formData.fungible_token_id) {
      newErrors.fungible_token_id =
        'Please select a token for fungible campaigns';
    }

    // Media validation (optional but if provided, must be valid)
    if (formData.media.length > 5) {
      newErrors.media = 'Maximum 5 media files allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, getUserBalance, getMaxBudget]);

  // Save draft
  const saveDraft = useCallback(async (): Promise<void> => {
    if (!validateForm()) {
      toast.error('⚠️ Please fix the validation errors before saving', {
        position: 'top-right',
        autoClose: 4000,
      });
      return;
    }

    try {
      // Convert files to base64 strings for API
      const mediaStrings: string[] = [];
      for (const file of formData.media) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        mediaStrings.push(base64);
      }

      const draftPayload = {
        name: formData.name,
        tweet_text: formData.tweet_text,
        expected_engaged_users: formData.expected_engaged_users,
        campaign_budget: formData.campaign_budget,
        type: formData.type,
        media: mediaStrings,
        fungible_token_id:
          formData.type === 'FUNGIBLE' ? formData.fungible_token_id : undefined,
      };

      const result = await createDraft(draftPayload).unwrap();

      if (result.success && result.data.draftId) {
        setSavedDraftId(result.data.draftId);
        toast.success(
          '✅ Campaign draft saved successfully! You can now publish it.',
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      } else {
        toast.error(result.message || 'Failed to save campaign draft', {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    } catch (error: unknown) {
      console.error('Failed to save draft:', error);
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(
        err?.data?.message ||
          err?.message ||
          'Failed to save campaign draft. Please try again.'
      );
    }
  }, [formData, validateForm, createDraft]);

  // Publish campaign
  const publishCampaignAction = useCallback(async (): Promise<void> => {
    if (!savedDraftId) {
      toast.error('Please save a draft first before publishing');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the validation errors before publishing');
      return;
    }

    try {
      const result = await publishCampaignMutation({
        draftId: savedDraftId,
        publishData: {
          publish_now: true,
          auto_approve: false,
        },
      }).unwrap();

      if (result.success) {
        toast.success(
          '🚀 Campaign published successfully! Redirecting to dashboard...',
          {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        // Small delay to show success message before navigation
        setTimeout(() => {
          navigate('/dashboard?tab=campaigns&refresh=true');
        }, 1500);
      } else {
        toast.error(result.message || 'Failed to publish campaign', {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    } catch (error: unknown) {
      console.error('Failed to publish campaign:', error);
      const err = error as { data?: { message?: string }; message?: string };
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        'Failed to publish campaign. Please try again.';
      toast.error(errorMessage);
    }
  }, [savedDraftId, validateForm, publishCampaignMutation, navigate]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setSavedDraftId(null);
  }, []);

  return {
    // Form state
    formData,
    setFormData,
    errors,

    // API state
    isDraftLoading,
    isPublishLoading,
    isLoading,
    savedDraftId,

    // Token data
    tokenBalances,
    isLoadingTokens,

    // Actions
    handleFieldChange,
    handleMediaUpload,
    removeMediaFile,
    validateForm,
    saveDraft,
    publishCampaign: publishCampaignAction,
    resetForm,

    // Balance helpers
    getUserBalance,
    getMaxBudget,
  };
};

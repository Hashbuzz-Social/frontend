import { configureStore } from '@reduxjs/toolkit';
import miscellaneousStoreSlice from './miscellaneousStoreSlice';
import landingPageStoreSlice from '@/Ver2Designs/Pages/Landing/LandingV3/landingPageStoreSlice';
import authReducer from '@/Ver2Designs/Pages/AuthAndOnboard/authStoreSlice';
import campaignReducer from './campaignSlice';
import campaignListReducer from './campaignListSlice';
import { apiBase } from '../API/apiBase';
import { mirrorNodeApi } from '../API/mirrorNodeAPI';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    app: miscellaneousStoreSlice,
    landingPage: landingPageStoreSlice,
    auth: authReducer,
    campaign: campaignReducer,
    campaignList: campaignListReducer,
    // RTK Query API slices
    [apiBase.reducerPath]: apiBase.reducer,
    [mirrorNodeApi.reducerPath]: mirrorNodeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiBase.middleware,
      mirrorNodeApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

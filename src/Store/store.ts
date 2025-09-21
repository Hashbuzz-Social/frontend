import authReducer from '@/Ver2Designs/Pages/AuthAndOnboard/authStoreSlice';
import landingPageStoreSlice from '@/Ver2Designs/Pages/Landing/LandingV3/landingPageStoreSlice';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { apiBase } from '../API/apiBase';
import { mirrorNodeApi } from '../API/mirrorNodeAPI';
import appStatusSlice from './appStatusSlice';
import campaignListReducer from './campaignListSlice';
import campaignReducer from './campaignSlice';
import miscellaneousStoreSlice from './miscellaneousStoreSlice';
import { webSocketMiddleware } from './webSocketMiddleware';
import webSocketReducer from './webSocketSlice';

// Create store with WebSocket middleware
const store = configureStore({
  reducer: {
    appStatus: appStatusSlice,
    app: miscellaneousStoreSlice,
    landingPage: landingPageStoreSlice,
    auth: authReducer,
    campaign: campaignReducer,
    campaignList: campaignListReducer,
    webSocket: webSocketReducer,
    // RTK Query API slices
    [apiBase.reducerPath]: apiBase.reducer,
    [mirrorNodeApi.reducerPath]: mirrorNodeApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(apiBase.middleware, mirrorNodeApi.middleware)
      .concat(webSocketMiddleware),
});

export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

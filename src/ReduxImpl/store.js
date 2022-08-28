import {combineReducers, configureStore} from '@reduxjs/toolkit';
import caseListReducer from './Reducers/CovidCaseSlice';
import configReducer from './Reducers/ConfigSlice';
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {configState, covid_cases} from "./Reducers/initialState";

const persistConfig = {key: 'root', version: 1, storage}
const allReducers = combineReducers({
  covid_cases: caseListReducer,
  configs: configReducer,
//  ...Other reducers go here
})
const preloadedState = {covid_cases: {...covid_cases}, configs: {...configState}}
const persistedReducer = persistReducer(persistConfig, allReducers,)
export const store = configureStore({
  reducer: persistedReducer, middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false
  }), preloadedState
})

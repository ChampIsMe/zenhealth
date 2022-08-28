/* eslint-disable no-unused-vars */
import {createSlice} from '@reduxjs/toolkit';
import {configState} from "./initialState";

const initialState = {...configState}
export const configSlice = createSlice({
  name: 'configs', initialState,
  reducers: {
    resetConfigs: (state) => {
      Object.keys(initialState).map(key => state[key] = initialState[key])
    }, updateCaseListFilters: (state, action) => {
      state.caseListFilters = [...action.payload]
    }
  }
});
export const {resetConfigs, updateCaseListFilters} = configSlice.actions;
export default configSlice.reducer;

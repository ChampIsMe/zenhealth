/* eslint-disable no-unused-vars */
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {apiRequest} from "../../Apis"
import querystring from 'querystring'
import {covid_cases} from "./initialState";
import {errMsg, getToastId, toastUp, updateToast} from "../../components/utils/reducerUtils";

const initialState = {...covid_cases}
export const fetchCovidCases = createAsyncThunk('/covid_cases', async (parms, thunkAPI) => {
  return new Promise(async (resolve, reject) => {
    try {
      const state = await thunkAPI.getState();
      //can be object or a single variable e.g case ID
      let params = typeof parms === 'object' ? {...parms} : parms
      let queryString
      let pageQueries;
      //Build parameters for pagination and filters
      if (params && params['filterData']) {
        queryString = (params && params['filterData']) ? '?' + querystring.stringify(params['filterData']) : ""
        pageQueries = params.pagination ? params : {pagination: state.covid_cases.caseListPagination};
        queryString += `&page=${pageQueries.pagination.current}&limit=${pageQueries.pagination.pageSize}`
      } else {
        pageQueries = params && params.pagination ? params : {pagination: state.covid_cases.caseListPagination};
        queryString = pageQueries && pageQueries.pagination && pageQueries.pagination.current ? `?page=${pageQueries.pagination.current}&limit=${pageQueries.pagination.pageSize}` : ""
      }
      let response;
      let data;
      console.log('queryString', queryString)
      response = await apiRequest.get(`/covidcases/listcases${queryString}`);
      console.log('Response:  ', response)
      data = response.data.map(item => ({...item, latlng: [item.lng, item.lat]}))
      console.log('data:  ', data)
      const payload = {data, pagination: {...pageQueries.pagination, total: 100}}
      resolve(payload)
    } catch (e) {
      toastUp(errMsg(e, true, 'covid cases'), false)
      reject(e)
    }
  })
})

export const reportCovidCase = createAsyncThunk('reportCovidCase', async (payload, thunkAPI) => {
  return new Promise(async (resolve, reject) => {
    const toastId = getToastId('Adding covid case')
    try {
      const response = await apiRequest.post(`/covidcases/savecases`, payload)
      await thunkAPI.dispatch(fetchCovidCases());
      updateToast(toastId, `added successfully`, true)
      resolve(response.data)
    } catch (e) {
      updateToast(toastId, errMsg(e, false), false)
      console.log(e)
      reject(e)
    }
  })
})

export const covidCaseSlice = createSlice({
  name: 'cases', initialState,
  reducers: {
    resetCovidCases: (state, action) => {
      state.cases = [];
    },
    selectCovidCase: (state, action) => {
      state.selectedCovidCase = action.payload;
    }, resetCaseListPagination: (state) => {
      state.caseListPagination = {...initialState.caseListPagination}
    }
  }, extraReducers: {
    [fetchCovidCases.fulfilled]: (state, action) => {
      state.cases = [...action.payload.data]
      state.caseListPagination = {...action.payload.pagination}
    },
  }
});

export const {resetCovidCases, selectCovidCase, resetCaseListPagination} = covidCaseSlice.actions;
export default covidCaseSlice.reducer;

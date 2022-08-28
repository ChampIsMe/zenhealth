/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import {Button, Table, Typography} from "antd";
import useBreakpoint from "../hooks/useBreakPoint";
import {dialogCloser, dialogOpener, emptyFun, emptyTable, executeChunkFn, onTableChange, primaryButton, responsiveTbl} from "../utils/util";
import {connect, useDispatch} from "react-redux";
import {updateCaseListFilters} from "../../ReduxImpl/Reducers/ConfigSlice";
import {fetchCovidCases, reportCovidCase, resetCaseListPagination} from "../../ReduxImpl/Reducers/CovidCaseSlice";
import moment from 'moment'
// import caseList from './dev.json';
import {EditTwoTone} from "@ant-design/icons";
import DynamicForm from "../InputComponents/DynamicForm";
import {errMsg, toastUp} from "../utils/reducerUtils";
import TableFilters from "../InputComponents/TableFilters";

const {Text} = Typography;
const columns = [
  {title: 'Country', dataIndex: 'country', key: 'country', fltr: {filterable: true, type: 'string'}},
  {
    title: 'Last updated', dataIndex: 'updated', key: 'updated', fltr: {filterable: false, type: 'date_range'},
    render: (start_at, record) => (<Text strong={true}>{moment(start_at).format("MM/DD/YYYY")}</Text>)
  },
  {title: 'Covid cases', dataIndex: 'confirmed', key: 'confirmed', fltr: {filterable: true, type: 'string'}},
  {title: 'Recovered patients', dataIndex: 'recovered', key: 'recovered', fltr: {filterable: false, type: 'string'}},
  {title: 'Population', dataIndex: 'population', key: 'population', fltr: {filterable: false, type: 'string'}},
  {title: 'Country size(km²)', dataIndex: 'sq_km_area', key: 'sq_km_area', fltr: {filterable: false, type: 'string'}},
  {title: 'Life expectancy', dataIndex: 'life_expectancy', key: 'life_expectancy', fltr: {filterable: false, type: 'string'}},
  {title: 'Continent', dataIndex: 'continent', key: 'continent', fltr: {filterable: true, type: 'string'}},
  {title: 'Capital city', dataIndex: 'capital_city', key: 'capital_city', fltr: {filterable: true, type: 'string'}},
  {fltr: {filterable: false}, render: (record) => <Button shape="circle" icon={<EditTwoTone/>}/>}
]

let covidCaseInputs = {
  fields: [//Dynamic form fields
    {name: 'country', label: 'Country', required: true, type: 'string'},
    {name: 'confirmed', label: 'Covid cases', required: true, type: 'number'},
    {name: "recovered", label: 'Recovered patients', required: true, type: 'number'},
    {name: "deaths", label: 'Deaths', required: true, type: 'number'},
    {name: "population", label: 'Population', required: false, type: 'number'},
    {name: "sq_km_area", label: 'Country size(km²)', required: true, type: 'number'},
    {name: "life_expectancy", label: 'Life expectancy', required: false, type: 'number'},
    {name: "elevation_in_meters", label: 'Elevation in meters', required: false, type: 'number'},
    {name: "continent", label: 'Continent', required: true, type: 'string'},
    {name: "abbreviation", label: 'Abbreviation', required: true, type: 'string'},
    {name: "location", label: 'Location', required: true, type: 'string'},
    {name: "capital_city", label: 'Capital City', required: true, type: 'string'}
  ],
  defaultValues: {lat: "33.93911", long: "67.709953",updated:"2022-08-17 04:20:59"},//default values for the form
  actionName: 'Report covid case',//Form ID for form entries collection if you have different forms in this component
  exitOnFinish: false// whether to close the form after onFinish
}
const CovidCaseList = ({ cases, appConf, caseListPagination}) => {
  const dispatch = useDispatch()
  const breakPoint = useBreakpoint();
  
  const [isExecuting, setisExecuting] = useState(false)
  const [covidCaseInputFields, setCovidCaseInputFields] = useState({...covidCaseInputs})
  const [isVisible, setIsVisible] = useState(false);
  const [isDynamicFormOpen, setDynamicFormOpen] = useState(false)
  useEffect(() => {
    console.log({caseListPagination})
    loadCovidCases(true).catch(console.log)
    return emptyFun
  }, [])
  
  const loadCovidCases = async (isMQ) => {
    await dispatch(updateCaseListFilters([false, undefined, true]))
    await dispatch(fetchCovidCases(appConf.caseListFilters[0] ? appConf.caseListFilters[1] : undefined))
    await dispatch(updateCaseListFilters([false, undefined, false]))
  }
  const onFormEntries = async (entries) => {
    console.log('entries: ', entries)
    try {
      switch (entries.actionName) {
        case 'Report covid case':
          await setisExecuting(true)
          await executeChunkFn(dispatch, reportCovidCase, {...entries.values,...covidCaseInputFields.defaultValues}, setisExecuting, dialogCloser(setDynamicFormOpen), null)
          break
        default:
          return
      }
    } catch (e) {
      console.log(e)
      toastUp(errMsg(e, false, 'covid case'), false)
    }
  }
  
  async function handleFilterAction(action, values) {
    console.log('handleFilterAction: ', values, action)
    await dispatch(resetCaseListPagination())
    if (action === 'filter') {
      let pl = {filterData: {...values}, pagination: caseListPagination}
      await dispatch(updateCaseListFilters([false, pl, true]))
      await dispatch(fetchCovidCases(pl))
      await dispatch(updateCaseListFilters([true, pl, false]))
    }
    if (action === 'reset') {
      await dispatch(updateCaseListFilters([appConf.caseListFilters[0], undefined, true]))
      await dispatch(fetchCovidCases())
      await dispatch(updateCaseListFilters([false, undefined, false]))
    }
    setIsVisible(false)
  }
  
  return (
    <div>
      <DynamicForm closeDialog={dialogCloser(setDynamicFormOpen)} isDynamicFormOpen={isDynamicFormOpen} inputFields={covidCaseInputFields} onFormEntries={onFormEntries} isExecuting={isExecuting}/>
      <Table title={() => (
        <TableFilters filtersOnly={true} datasource={[...columns]}
                      setIsVisible={setIsVisible}
                      filters={appConf.caseListFilters[1]}
                      actionButton={primaryButton(dialogOpener(setDynamicFormOpen), 'Report case', null, 'Reporting', null, null)}
                      isVisible={isVisible}
                      showClear={appConf.caseListFilters[0]}
                      loading={appConf.caseListFilters[2]}
                      handleFilterAction={handleFilterAction}/>)}
             rowKey={'country'} columns={columns} dataSource={cases} loading={appConf.caseListFilters[2]} size={'small'} {...responsiveTbl(breakPoint)}
             locale={{emptyText: emptyTable('covid cases.')}}
             onChange={(pagination, filters,
                        sorter) => onTableChange(pagination, filters, sorter, dispatch, fetchCovidCases, appConf.caseListFilters, updateCaseListFilters, null)}
             onRow={(record, rowIndex) => {
               return {
                 onClick: event => {
            
                 }, // click row
               };
             }}
      
             pagination={caseListPagination}/>
    </div>
  )
};


const mapStateToProps = (state) => ({
  cases: state.covid_cases.cases,
  appConf: state.configs,
  caseListPagination: state.covid_cases.caseListPagination,
})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(CovidCaseList)

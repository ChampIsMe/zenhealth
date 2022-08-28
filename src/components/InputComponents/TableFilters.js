/* eslint-disable no-unused-vars,react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Button, Col, Dropdown, Form, Input, Row, Space} from "antd";
import {dynamicFormOnFinish, emptyFun, getDynamicFormDefaultValues, getInputField, useOnClickOutside} from "../utils/util";
import moment from "moment";
import useBreakpoint from "../hooks/useBreakPoint";
import {CaretDownOutlined, FilterOutlined, ReloadOutlined} from "@ant-design/icons";
import _ from "lodash";

export const TableFilters = (
  {datasource, setIsVisible, isVisible, handleFilterAction, showClear, loading, filters, actionButton, ...props}) => {
  const ref = useRef();
  const {Search} = Input;
  const [form] = Form.useForm();
  const dateFormat = 'MM/DD/YYYY';
  const point = useBreakpoint()
  const [searchVal, setsearchVal] = useState(null)
  const [searchLoading, setsearchLoading] = useState(false)
  const [datePopupOpen, setDatePopupOpen] = useState(false)
  const [selectPopupOpen, setSelectPopupOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [phoneValue, setPhoneValue] = useState(undefined);
  // console.log('FilterBody filters: ', filters)
  const [filterData, setFilterData] = useState(showClear && !!filters ? {...filters.filterData} : {})
  const [filterHasData, setFilterHasData] = useState(showClear && showClear && !!filters?.filterData)
  const [formInputs, setFormInputs] = useState({fields: []})
  useEffect(() => {
    (async () => {
      if (!!datasource[0]) {
        let data = datasource && datasource.length ? datasource.filter(item => item.fltr && item.fltr.filterable) : []
        let formInputs = {
          fields: data.map(item => ({
            name: item.key, label: item.title, required: false, type: item.fltr.type, fullRow: true,
            ...(item.fltr.type === 'autocomplete' && {options: item.fltr.options}),
            ...(item.fltr.type === 'date' && {dateFormat}),
            props: {
              ...(item.fltr.type === 'autocomplete' && {onDropdownVisibleChange: open => setSelectPopupOpen(open)}),
              ...(item.fltr.type === 'date' && {onOpenChange: (open) => setDatePopupOpen(open)}),
              ...(item.fltr.type === 'date_range' && {onOpenChange: (open) => setDatePopupOpen(open)}),
              ...(item.fltr.type === 'phone' && {setPhoneValue, phoneValue, setSelectPopupOpen: setSelectPopupOpen}),
            }
          }))
        }
        await setFormInputs(formInputs)
      }
    })().catch(console.log)
    return emptyFun
  }, [datasource])
  useEffect(() => {
    setFilterHasData(showClear)
    return emptyFun
  }, [showClear])
  useEffect(() => {
    console.log('applied Filters:::: ', filters)
    if (!!filters?.filterData) {
      setFilterData({...filters.filterData})
    }
    console.log('applied Filters::::1 ', filterData)
    if (!isVisible) {
      return emptyFun
    }
    if (!filters) {
      form.setFieldsValue({})
      setFilterData({})
      return emptyFun
    }
    if (Object.keys(filterData).length > 0) {
      if (!filterData.search) {
        let filterData_ = getDynamicFormDefaultValues(datasource, filterData, formInputs)
        console.log('Setting: ', filterData_)
        form.setFieldsValue({...filterData_})
      } else {
        console.log('Search: ')
        form.setFieldsValue({...(!!filterData.search && {search: filterData.search})})
      }
    } else {
      form.setFieldsValue({})
    }
    return emptyFun
  }, [filters, showClear, isVisible])
  const onSearch = async value => {
    if (!!value && value.trim().length > 0) {
      setsearchLoading(true)
      await setFilterData({search: value})
      handleFilterAction('filter', {search: value.trim()});
    }
    if (!value || value === '') {
      setsearchLoading(true)
      setFilterData({})
      clearFilters()
    }
  }
  const renderEmpty = () => (<div style={{textAlign: 'center'}}>
    <FilterOutlined/>
    <p style={{color: 'gray'}}>No filter criteria!</p>
  </div>)
  
  const filter = async () => {
    if (loading) {
      return
    }
    let values = {...form.getFieldsValue(), ...phoneValue}
    Object.keys(values).forEach(k => (!values[k] || values[k] === "") && delete values[k])
    let filters = dynamicFormOnFinish(formInputs, values)
    if (Object.keys(filters).length > 0) {
      filters.pagination = 1
      console.log('filters: ', filters)
      handleFilterAction('filter', filters)
    } else {
      clearFilters()
    }
  }
  const clearFilters = () => {
    setsearchVal(undefined)
    if (loading) {
      return
    }
    form.resetFields()
    setShowSearch(true)
    handleFilterAction('reset');
    setFilterData({})
  }
  const cancelFilter = () => {
    if (loading) {
      return
    }
    setShowSearch(true)
    handleFilterAction('cancel')
  }
  useOnClickOutside(ref, () => {
    if (!datePopupOpen && !selectPopupOpen) {
      setIsVisible(false)
    }
  });
  const debouncedChangeHandler = useCallback(
    _.debounce(value => {
      onSearch(value).catch(console.log)
    }, 800),
    []
  );
  const getForm = () => {
    return (
      <Row style={{width: '100%', background: 'white', borderStyle: 'solid', borderRadius: 6, borderColor: 'gainsboro'}}>
        <Col flex={"auto"} style={{width: '100%'}}>
          <Form
            style={{width: '100%'}}
            labelCol={{sm: 24, xs: 24, md: 24, lg: 24, xl: 24, xxl: 24}}
            name="filters"
            preserve={false}
            // initialValues={filterData}
            onValuesChange={(changedValues, allValues) => {
              console.log('changedValues: ', changedValues)
              console.log('allValues: ', allValues)
              let values = {...allValues}
              let keys = Object.keys(values)
              for (const k of keys) {
                if (values[k] instanceof moment) values[k] = moment(values[k]).format(dateFormat)
              }
              setShowSearch(Object.keys(values).length === 0)
              // setFilterData(values)
            }}
            form={form}
            layout="vertical">
            <Row justify={"space-around"} ref={ref} style={{padding: 0, width: '100%'}}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} flex={"auto"} style={{width: '100%', height: '100%', padding: 10}}>
                {
                  !!formInputs.fields[0] ? <Row gutter={[4, 0]} align={"stretch"} justify={"start"} style={{width: '100%', margin: 0, marginBottom: 14}}>
                    {formInputs.fields.map((field, index) => field.fullRow ? <Col key={index} xs={24} sm={24} md={24} lg={24} xl={24} flex={"auto"} style={{width: '100%'}}>{getInputField(field)}</Col> :
                      <Col key={index} xs={24} sm={24} md={24} lg={24} xl={24} flex={"auto"} style={{width: '100%'}}>{getInputField(field)}</Col>)}
                  </Row> : renderEmpty()
                }
                {(datasource && datasource.length > 0) && <Row style={{width: '100%'}} justify={"end"}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{textAlign: 'center'}}>
                    <Space>
                      <Button onClick={() => cancelFilter()} size="small" disabled={loading} type="default" style={{width: 90, marginRight: 30}}>Cancel</Button>
                      {/*<Button onClick={() => clearFilters()}
                          type={"dashed"}
                          size="small" style={{width: 90, color: '#CB1D4D'}}>
                    Reset
                  </Button>*/}
                      <Button style={{width: 90}} type="primary" size="small" loading={loading} onClick={() => filter()}> Filter </Button>
                    </Space>
                  </Col>
                </Row>}
              </Col>
            </Row>
          </Form>
        
        </Col>
      </Row>)
  }
  return <div
    style={{
      display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: 0, paddingBottom: 0, paddingTop: 0, margin: 0, justifyContent: 'flex-start',
      alignItems: 'center', alignContent: 'center', bgcolor: 'background.paper', width: '100%'
    }}>
    <Dropdown destroyPopupOnHide={true} overlay={getForm()} visible={isVisible} disabled={loading} arrow={true}
              overlayStyle={{width: ['xs'].includes(point) ? '100%' : point === 'sm' ? '40%' : point === 'md' ? '25%' : point === 'lg' ? '20%' : '15%'}}>
      <Button onClick={() => setIsVisible(prevState => !prevState)} icon={<FilterOutlined/>}>Filters <CaretDownOutlined/></Button>
    </Dropdown>
    {(showSearch && !isVisible) &&
    <Search placeholder="Search" onSearch={onSearch} enterButton={!loading} defaultValue={filterData.search || undefined} value={searchVal || undefined}
            onChange={(event => {
              setsearchVal(event.target.value)
              debouncedChangeHandler(event.target.value);
            })}
            onPressEnter={e => onSearch(e.target.value)}
            size={"middle"}
            style={{width: 190, backgroundColor: 'transparent', marginLeft: 6, marginRight: 6}}
      // disabled={loading}
    />}
    {(!isVisible && filterHasData) &&
    <Button onClick={() => clearFilters()} type={"dashed"} size="middle" danger={true} loading={loading} style={{borderRadius: 6, fontWeight: 600, marginRight: 6}}>
      Clear Filters
    </Button>}
    {(!loading && !isVisible) && <Button shape="circle" onClick={() => filter()} icon={<ReloadOutlined/>}/>}
    {!!actionButton && <div style={{flexGrow: 1, textAlign: point === 'xs' ? 'start' : 'end'}}>{actionButton}</div>}
  </div>
};
export default TableFilters

import {AutoComplete, Button, DatePicker, Empty, Form, Select} from "antd";
import parsePhoneNumber from 'libphonenumber-js'
import moment from "moment";
import AppPhoneInput from "../widgets/AppPhoneInput";
import Input from "antd/es/input/Input";
import {CaretDownOutlined, CloseCircleOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";

/**
 * Make table responsive based on screen size
 * */
export const responsiveTbl = (breakpoint) => breakpoint === 'sm' || breakpoint === 'xs' ? {scroll: {x: 900}} : {scroll: {x: 0}}

/**
 * @param otherParams is passed when
 * @param chunkFn is called without
 * @param filterState but the chunkFn requires at least one param. i.e pagination triggered without filters specified by user
 * --------------------
 * @param pagination
 * @param confUpdateFn to update local state of the table
 * @param filters is request filters for @param filterState
 * @param sorter
 * @param dispatch
 * */
export const onTableChange = async (pagination, filters, sorter, dispatch, chunkFn, filterState, confUpdateFn, otherParams) => {
  console.log('onTableChange: ', filterState)
  let params = {}
  if (filterState[0]) {
    let filterObj = {...filterState[1]}//escape js object's read only restriction
    delete filterObj.pagination
    params = filterObj
  }
  params = {...params, sortField: sorter.field, sortOrder: sorter.order, pagination, ...filters}
  await dispatch(confUpdateFn([filterState[0], filterState[0] ? filterState[1] : undefined, true]))
  await dispatch(chunkFn({...params, ...((!filterState[0] && !!otherParams) && {filterData: otherParams})}));//if no user filters, pass the default params if any
  await dispatch(confUpdateFn([filterState[0], filterState[0] ? filterState[1] : undefined, false]))
}


export const emptyTable = (message) => <div style={{textAlign: 'center', width: '100%'}}>
  <Empty image={require('../../assets/empty_table.svg').default} imageStyle={{height: '100%', textAlign: 'center'}} description={``}/></div>

export const cleanPhoneNumber = (phone, attr) => {
  const phoneNumber = parsePhoneNumber(phone)
  if (!phoneNumber) {
    return {[attr]: undefined, phoneCode: undefined}
  }
  console.log('phoneNumber:  ', phoneNumber)
  let phoneCode = phoneNumber?.countryCallingCode
  return {[attr]: phoneNumber?.nationalNumber, phoneCode}
}
export const formatPhone = (phone) => phone.replaceAll(/\(/, '').replaceAll(/\)/, '').replaceAll(/-/, '').replaceAll(' ', '')
export const getInputField = (field) => {
  switch (field.type) {
    case "string":
    case "number":
      return <Form.Item
        style={{width: '100%', margin: 0, marginBottom: '2px',}}
        name={field.name}
        label={field.label}
        rules={[{required: field.required, message: `Missing ${field.label}`}]}>
        <Input type={field.type} autoComplete={'off'}/>
      </Form.Item>
    case "select":
      // console.log('field: ', field)
      // console.log('inputFields: ', inputFields)
      return <Form.Item
        style={{width: '100%', margin: 0, marginBottom: '2px',}}
        name={field.name}
        label={field.label}
        rules={[{required: field.required, message: `Missing ${field.label}`}]}>
        <Select style={{width: '100%'}}> {field.options.map(item => <Select.Option value={item}>{item}</Select.Option>)} </Select>
      </Form.Item>
    case "autocomplete":
      // console.log('field: ', field)
      // console.log('inputFields: ', inputFields)
      return <Form.Item
        style={{width: '100%', margin: 0, marginBottom: '2px',}}
        name={field.name}
        label={field.label}
        rules={[{required: field.required, message: `Missing ${field.label}`}]}>
        <AutoComplete dropdownMatchSelectWidth={false} style={{width: '100%', borderRadius: "4px"}} placeholder={'Select'}
                      options={field.options}
          // value={filterData[dataItem.key]}
                      filterOption={true}
                      {...field.props}
                      children={<Input style={{backgroundColor: 'transparent'}} suffix={<CaretDownOutlined fontSize={"small"} style={{color: 'gray'}}/>}/>}>
        </AutoComplete>
      </Form.Item>
    case "multiselect":
      // console.log('multiselect field: ', field)
      // console.log('inputFields: ', inputFields)
      return <Form.Item
        style={{width: '100%', margin: 0, marginBottom: '2px',}}
        name={field.name}
        label={field.label}
        rules={[{required: field.required, message: `Missing ${field.label}`}]}>
        <Select placeholder={'Select'} mode={'multiple'} allowClear={true} style={{width: '100%'}}> {Object.keys(field.options).map(item => <Select.Option
          value={item}>{field.options[item]}</Select.Option>)} </Select>
      </Form.Item>
    case 'radio_group':
      return <div className="dot-circle-active" style={{background: 'crimson'}}/>
    case 'date_range':
      // console.log('field: ', field)
      return <Form.Item
        style={{width: '100%', margin: 0, marginBottom: '2px'}}
        name={field.name}
        label={field.label}
        rules={[{required: field.required, message: `Missing ${field.label}`}]}>
        <DatePicker.RangePicker style={{width: '100%'}} {...field.props}/>
      </Form.Item>
    case 'date':
      // console.log('field: ', field)
      return <Form.Item
        style={{width: '100%', margin: 0, marginBottom: '2px'}}
        name={field.name}
        label={field.label}
        rules={[{required: field.required, message: `Missing ${field.label}`}]}>
        <DatePicker style={{width: '100%'}} placeholder={field.dateFormat} format={field.dateFormat} {...field.props} />
      </Form.Item>
    case 'phone':
      // console.log('field: ', field)
      return <Form.Item
        style={{width: '100%', margin: 0, marginBottom: '2px'}}
        name={field.name}
        label={field.label}
        rules={[{required: field.required, message: `Missing ${field.label}`}]}>
        <AppPhoneInput name={field.name} {...field.props} formItemProps={{style: {width: '100%'}}}/>
      </Form.Item>
    default:
      return null
  }
}
export const dynamicFormOnFinish = (formInputs, values) => {
  Object.keys(values).map(valKey => {
    let value = values[valKey]
    let formInput = formInputs.fields.find(item => item.name === valKey)
    if (formInput.type === 'date') {
      values[valKey] = moment(value).format(formInput.dateFormat)
    }
    if (formInput.type === 'autocomplete') {
      let selectedItem = formInput.options.find(item => item.value === value)
      // console.log('formInput: ', formInput)
      // console.log('value: ', value)
      // console.log('selectedItem: ', selectedItem)
      values[valKey] = selectedItem.actualValue
    }
    return valKey;
  })
  return values
}
export const getDynamicFormDefaultValues = (datasource, defaultValues, formInputs) => {
  let autocompleteFields = datasource && Array.isArray(datasource) ? datasource.filter(item => item.fltr && item.fltr.filterable && item.fltr.type === 'autocomplete') : []
  let dateFields = datasource && Array.isArray(datasource) ? datasource.filter(item => item.fltr && item.fltr.filterable && item.fltr.type === 'date') : []
  let defaultValues_ = {...defaultValues}
  if (dateFields.length > 0) {
    let keys = dateFields.map(item => item.key)
    for (const key of keys) {
      if (defaultValues[key]) {
        console.log('Setting Date: ', defaultValues[key])
        defaultValues_ = {...defaultValues_, [key]: moment(defaultValues[key])}
      }
    }
  }
  if (autocompleteFields.length > 0) {
    let keys = autocompleteFields.map(item => item.key)
    for (const key of keys) {
      let formInput = formInputs.fields.find(item => item.name === key)
      if (defaultValues[key]) {
        let selectedItem = formInput.options.find(item => item.actualValue === defaultValues[key])
        // console.log('formInput: ', formInput)
        // console.log('value: ', defaultValues[key])
        // console.log('selectedItem: ', selectedItem)
        defaultValues_ = {...defaultValues_, [key]: selectedItem['label']}
      }
    }
  }
  return defaultValues_
}

export const emptyFun = () => ({})

export const dialogOpener = (cb) => () => cb(true)
export const openDialog = (cb) => cb(true)
export const dialogCloser = (cb) => () => cb(false)
export const closeDialog = (cb) => cb(false)
// export const modalClose = (onClose) => (<Button shape="circle" icon={<CloseCircleOutlined/>} onClick={onClose}/>)
export const modalClose = (onClose) => (<CloseCircleOutlined style={{fontSize: '26px'}}/>)
/**
 * Used to ensure form dialogs dont close if requests are unsuccessful, reusing redundant code
 * if there are any other code to be executed based on success or failure of this chunk call apart from chunkFn, setProgress and closerFn which is a cleanup function, then call this function from a try catch and add the extra statements under the call. see createProspect call as example
 * */
export const executeChunkFn = (dispatch, chunkFn, payload, setProgress, closerFn, afterChunkFn) => {
  return new Promise(async (resolve, reject) => {
    try {
      await setProgress(true)
      await dispatch(chunkFn(payload)).unwrap()
      if (!!afterChunkFn) {
        await afterChunkFn()
      }
      setProgress(false)
      if (!!closerFn) {
        closerFn()
      }
      resolve()
    } catch (e) {
      setProgress(false)
      reject()
    }
  })
  
}

export const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
export const primaryButton = (onClick, text, loading, loadingText, styleProps, componentProps) => {
  return (<Button type={"primary"} onClick={onClick} variant={"contained"}
                  style={{textTransform: 'none', cursor: loading ? 'not-allowed' : 'pointer', ...styleProps}}> {!loading ? text : loadingText + '...'} </Button>)
}
export const outlinedButton = (onClick, text, loading, loadingText, styleProps, componentProps) => {
  return (<Button {...componentProps} onClick={onClick} variant={"contained"}
                  style={{textTransform: 'none', cursor: loading ? 'not-allowed' : 'pointer', ...styleProps}}> {!loading ? text : loadingText + '...'} </Button>)
}

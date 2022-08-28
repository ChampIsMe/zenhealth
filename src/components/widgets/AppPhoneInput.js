/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Form, Input, Select} from "antd";
import countries from 'world_countries_lists/data/countries/en/countries.json';
import {AsYouType, isValidPhoneNumber} from 'libphonenumber-js'
import {defaultAreas} from "../../CommonData/AppData";
import {emptyFun} from "../utils/util";

const getNation = (phone_code) => {
  if (!phone_code) {
    return {"emoji": "🇺🇸", "phoneCode": "1", "short": "US", "label": "🇺🇸 US", "country": "United States of America"}
  }
  let nation = defaultAreas.find(item => item.phoneCode === Number(phone_code));
  return !!nation ? {...nation, label: `${nation.emoji} ${nation.short}`} : {"emoji": "🇺🇸", "phoneCode": "1", "short": "US", "label": "🇺🇸 US", "country": "United States of America"}
}
const AppPhoneInput = ({name, phoneValue, setPhoneValue, formItemProps, setSelectPopupOpen}) => {
  const [nations, setNations] = useState([]);
  const [nation, setNation] = useState(getNation(phoneValue?.phoneCode));
  const handleNationChange = (e) => {
    let nation = nations.find(item => item.phoneCode === e)
    setNation(nation)
    console.log('handleNationChange: ', e);
  }
  useEffect(() => {
    console.log('phoneValue2: ', phoneValue)
    console.log('nation: ', !!phoneValue?.phoneCode ? getNation(phoneValue.phoneCode) : undefined)
    return emptyFun
  }, [nation])
  useEffect(() => {
    let newArr = defaultAreas.map(country => {
      let country_ = countries.find(item => item.alpha2 === country.short.toLowerCase())
      return {...country, phoneCode: `${country.phoneCode}`, label: `${country.emoji} ${country.short}`, country: !!country_ ? country_.name : undefined}
    }).filter(item => !!item.country && item.allowed === true).sort((a, b) => {
      if (a.short > b.short) {
        return 1;
      }
      if (a.short < b.short) {
        return -1;
      }
      return 0;
    })
    console.log('newArr: ', newArr)
    setNations(newArr)
    return emptyFun
  }, [])
  const selectBefore = (
    <Select defaultValue={nation.phoneCode} value={nation.phoneCode} style={{width: '90px'}} onChange={handleNationChange} onDropdownVisibleChange={open => {
      if (!!setSelectPopupOpen) {
        setSelectPopupOpen(open);
      }
    }}>
      {nations.map((item, index) => <Select.Option key={index} value={item.phoneCode}>{item.label}</Select.Option>)}
    </Select>
  );
  
  return !!nations[0] &&
    <Form.Item
      {...formItemProps}
      style={{width: '100%'}}
      name={name}
      label="Phone Number"
      rules={[{
        required: true, message: 'Invalid Phone number or format',/* pattern: /^\d{10}/,*/ validator: async (rule, value) => {
          console.log('validator:', value)
          console.log('p validator:', /^\d{9,10}/.test(value.phone))
          const asYouType = new AsYouType(nation.short)
          asYouType.input(value)
          let phoneIn = asYouType.getNumber().number
          if (isValidPhoneNumber(phoneIn)) {
            setPhoneValue({...phoneValue, [name]: phoneIn})
            return Promise.resolve()
          } else {
            setPhoneValue({...phoneValue, [name]: undefined})
            return Promise.reject('Invalid Phone number or format')
          }
        }
      }]}>
      <Input autoComplete={'off'} addonBefore={selectBefore} placeholder={'##########'} minLength={10} type={'text'} maxLength={10}
             onChange={(e => {
               /*console.log('e:', e)
               if (!!e.target.value && e.target.value.length > 1 && e.target.value.startsWith('0')) {
                 form.setFieldsValue({...form.getFieldsValue(), [name]: e.target.value.substr(1)})
               }*/
             })}
      />
    </Form.Item>
};

export default AppPhoneInput;

import React, {useEffect} from 'react';
import {emptyFun, getInputField, modalClose} from "../utils/util";
import {Col, Form, Modal, Row} from "antd";

const DynamicForm = ({inputFields, isDynamicFormOpen, closeDialog, onFormEntries, isExecuting}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    // console.log('inputFields: ', inputFields)
    // console.log('isDynamicFormOpen: ', isDynamicFormOpen)
    return emptyFun
  })
  
  function onFinish(values) {
    onFormEntries({values: {...inputFields.defaultValues, ...values}, actionName: inputFields.actionName})
    if (inputFields.exitOnFinish) {
      closeDialog()
    }
  }
  
  return (<Modal
      title={inputFields.actionName}
      visible={(isDynamicFormOpen)}
      width={600}
      onCancel={closeDialog}
      closeIcon={modalClose(closeDialog)}
      maskClosable={false}
      confirmLoading={isExecuting}
      okText={isExecuting ? "Submitting" : 'Submit'}
      cancelText="Cancel"
      onOk={() => {
        console.log('onOk is called')
        if (isExecuting) {
          return
        }
        form.validateFields().then((values) => {
          // form.resetFields();
          onFinish(values);
        }).catch((info) => console.log('Validate Failed:', info));
      }}
      destroyOnClose={true}
      // okButtonProps={{loading: isExecuting}}
      cancelButtonProps={{disabled: isExecuting}}>
      <Form
        name="dynamicForm"
        id="dynamicForm"
        form={form}
        initialValues={{...inputFields.defaultValues}}
        layout="vertical"
        // onFinish={onFinish}
      >
        <Row gutter={[4, 0]} align={"stretch"} justify={"start"} style={{width: '100%', margin: 0}}>
          {inputFields.fields.map((field, i) => <Col key={`${i}`} xs={24} sm={24} md={12} lg={12} xl={12} flex={"auto"} style={{width: '100%'}}>{getInputField(field)}</Col>)}
        </Row>
      
      </Form>
    </Modal>
  );
};

export default DynamicForm;

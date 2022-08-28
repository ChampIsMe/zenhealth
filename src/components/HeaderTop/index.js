/* eslint-disable no-unused-vars */
import React from 'react'
import {Breadcrumb, Col, Image, Row} from 'antd';
import Avatar from "antd/es/avatar/avatar";

const HeaderTop = (props) => {
  
  return (<div className="filter-header">
    <Row gutter={[4, 1]} align={"stretch"} justify={"start"} style={{overflowWrap: 'break-word'}}>
      <Col xs={24} sm={24} md={24} lg={12} xl={12} flex={"auto"} style={{width: '100%', alignSelf: 'center', alignItems: 'center'}}>
        <Breadcrumb style={{margin: '16px 0', alignSelf: 'center'}}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Covid cases</Breadcrumb.Item>
        </Breadcrumb>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={12} flex={"auto"} style={{width: '100%', alignSelf: 'center', alignItems: 'center'}}>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Avatar size={56} src={<Image preview={true} src="https://media.premiumtimesng.com/wp-content/files/2020/03/who-logo-vector.png" style={{width: 56,}}/>}/>
        </div>
      </Col>
    </Row>
  </div>)
}
export default HeaderTop

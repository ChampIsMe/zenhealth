import {BarChartOutlined, HomeOutlined, TableOutlined,} from '@ant-design/icons';
import {Layout, Menu} from 'antd';
import React from 'react';
import Title from 'antd/lib/typography/Title';
import HeaderTop from "../HeaderTop";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import CovidCaseList from "../CovidCases/CovidCaseList";

const {Header, Content, Footer, Sider} = Layout;
const items = [{
  key: 'home',
  icon: <HomeOutlined/>,
  label: 'Home',
}, {
  key: 'covidcases',
  icon: <TableOutlined/>,
  label: `Covid cases`,
}, {
  key: 'new_route',
  icon: <BarChartOutlined/>,
  label: 'New Route',
}]

const AppLayout = () => {
  const navigate = useNavigate()
  const {pathname} = useLocation()
  const initialRoute = window.location.pathname.split('/')[1]
  const onMenuClick = (e) => navigate(e.key);
  return (
    <Layout hasSider>
      <Sider style={{overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0}}>
        <div className="logo"><Title style={{color: 'white'}} level={3}>Zen Health</Title></div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[initialRoute || pathname]} items={items} selectable={true} onClick={onMenuClick}/>
      </Sider>
      <Layout className="site-layout" style={{marginLeft: 200}}>
        <Header className="site-layout-background" style={{padding: 0}}><HeaderTop/></Header>
        <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
          <div className="site-layout-background" style={{padding: 24, textAlign: 'center'}}>
            <Routes>
              <Route path="/*">
                <Route index element={<div>Home route. Click covid cases to navigate to case list</div>}/>
                <Route path="home" element={<div>Home route. Click covid cases to navigate to case list</div>}/>
                <Route path="covidcases" element={<CovidCaseList/>}/>
                <Route path="new_route" element={<div>Another route</div>}/>
                <Route path="*" element={<div>Page not found</div>}/>
              </Route>
            </Routes>
          </div>
        </Content>
        <Footer style={{textAlign: 'center', bottom: 0, width: '100%', position: 'fixed'}}> Zen Health ©2022 Test Driven React </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;

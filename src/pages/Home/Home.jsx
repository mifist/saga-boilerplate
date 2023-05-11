import React, { memo } from 'react';
import { Helmet } from 'react-helmet';

// antd component
import { Layout, Button } from 'antd';
const { Content } = Layout;

// utils
import TestList from "./components/TestList";

function Home({ ...rest }) { 

  const onClickStore = () => {
    console.log('test')
  }

  return (
    <>
      <Layout className="app-main-layout">
        <Content className="layout-content" style={{padding: '30px'}}>
          <Button onClick={onClickStore}>Test store</Button>
          <TestList />
        </Content>
      </Layout>
    </>
  )
}

export default Home;
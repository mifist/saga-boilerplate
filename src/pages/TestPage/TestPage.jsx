import React, { memo } from 'react';

// antd component
import { Layout, Button } from 'antd';
const { Content } = Layout;


function TestPage({ ...rest }) { 

  const onClickStore = () => {
    console.log('test')
  }

  return (
    <>
      <Layout className="app-main-layout">
        <Content className="layout-content" style={{padding: '30px'}}>
          <Button onClick={onClickStore}>Test store</Button>

        </Content>
      </Layout>
    </>
  )
}

export default TestPage;
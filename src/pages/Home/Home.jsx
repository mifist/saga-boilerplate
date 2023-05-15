import React, { memo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

// styles
import './Home.scss';

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
        <Content className="layout-content" style={{ padding: '30px' }}>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="test">test</Link></li>
              <li><Link to="events">events</Link></li>
            </ul>
          </nav>
          
          <Button onClick={onClickStore}>Test store</Button>
          <TestList />
        </Content>
      </Layout>
    </>
  )
}

export default Home;
import React from 'react';
import {Redirect} from '@docusaurus/router';
import Layout from '@theme/Layout';

function Home() {
  return <Redirect to="/docs/" />;
}

export default Home;

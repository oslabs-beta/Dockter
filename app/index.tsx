// import React, { Fragment } from 'react';
// import { render } from 'react-dom';
// import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
// import { history, configuredStore } from './store';
// import './app.global.css';

// const store = configuredStore();

// const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

// document.addEventListener('DOMContentLoaded', () => {
//   const Root = require('./containers/Root').default;
//   render(
//     <AppContainer>
//       <Root store={store} history={history} />
//     </AppContainer>,
//     document.getElementById('root')
//   );
// });
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './tailwind.css';

ReactDOM.render(<App />, document.getElementById('root'));

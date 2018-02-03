// Data layer control (Redux)

// 如果你路径不加 ./，那么 weboack 就认为你这个东西在 node_modules
import 'materialize-css/dist/css/materialize.min.css'; 

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers'; // 不知道为什么这么写，而不是输出 combineReducers

// dummy store, wiil replace it shortly
const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

// #root is the element with id "root" in index.html
// Provider is a component that makes the store accessible to every component in the app
// Provider is the very parent component
ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>, 
  document.querySelector('#root')
);
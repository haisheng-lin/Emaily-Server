// Rendering layer control (React Router)
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import SurveyNew from './surveys/SurveyNew';

class App extends Component {

  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <div className="container">
            <Route exact path="/" component={ Landing } />
            <Route exact path="/surveys" component={ Dashboard } />
            <Route path="/surveys/new" component={ SurveyNew } />
          </div>
        </div>
      </BrowserRouter>
    );
  }
};

// connect 方法可以将连接 App 以及 actions，所以 App 可以通过 this.props 调用 actions
export default connect(null, actions)(App);
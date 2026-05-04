import './App.css';

import React from 'react';
import Navbar from './components/Navbar';
import News from './components/News';

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

const App = () => {

  return (
    <div>
      <Router>
        <Navbar />

        <LoadingBar
          color="hsla(69, 78%, 30%, 1.00)"
          progress={100}
        />

        <Switch>
          <Route exact path="/">
    <Redirect to="/technology" />
  </Route>

          <Route exact path="/technology">
            <News key="technology" country="us" category="technology" pageSize={5} />
          </Route>

          <Route exact path="/business">
            <News key="business" country="us" category="business" pageSize={5} />
          </Route>

          <Route exact path="/entertainment">
            <News key="entertainment" country="us" category="entertainment" pageSize={5} />
          </Route>

          <Route exact path="/general">
            <News key="general" country="us" category="general" pageSize={5} />
          </Route>

          <Route exact path="/health">
            <News key="health" country="us" category="health" pageSize={5} />
          </Route>

          <Route exact path="/science">
            <News key="science" country="us" category="science" pageSize={5} />
          </Route>

          <Route exact path="/sports">
            <News key="sports" country="us" category="sports" pageSize={5} />
          </Route>

        </Switch>

      </Router>
    </div>
  );
}

export default App;
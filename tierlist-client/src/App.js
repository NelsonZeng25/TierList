import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import {ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeFile from './util/theme';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

//Components
import Navbar from './components/layout/Navbar';
import AuthRoute from './util/AuthRoute';

// Pages
import home  from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import user from './pages/user';
import Sidebar from './components/layout/Sidebar';

const theme = createMuiTheme(themeFile);

// Only when its deploying time!
//axios.defaults.baseURL = "https://us-central1-tierlist-57d59.cloudfunctions.net/api";

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser);
    if (window.location.pathname !== '/login') window.location.href = '/login';
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
            <Navbar/>
            <Sidebar/>
            <div className="container">
              <div className="content-container">
                <Switch>
                  <Route exact path='/test' component={Sidebar}></Route>
                  <Route exact path='/' component={home}></Route>
                  <AuthRoute exact path='/login' component={login}></AuthRoute>
                  <AuthRoute exact path='/signup' component={signup}></AuthRoute>
                  <Route exact path='/users/:userId' component={user}></Route>
                  <Route exact path='/users/:userId/tierList/:tierListId' component={user}></Route>
                </Switch>
                </div>
            </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;

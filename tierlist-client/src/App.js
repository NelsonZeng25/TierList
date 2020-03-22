import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import {ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

//Components
import Navbar from './components/Navbar';

// Pages
import home  from './pages/home';
import login from './pages/login';
import signup  from './pages/signup';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#718792',
      main: '#455a64',
      dark: '#1c313a',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#b2fef7',
      main: '#80cbc4',
      dark: '#4f9a94',
      contrastText: '#000000',
    },
  },
  typography: {
    useNextVariant: true
  }
})

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Router>
        <Navbar />
          <div className="container">
            <Switch>
              <Route exact path='/' component={home}></Route>
              <Route exact path='/login' component={login}></Route>
              <Route exact path='/signup' component={signup}></Route>
            </Switch>
          </div>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;

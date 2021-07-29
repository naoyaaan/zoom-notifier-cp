import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home"
import Tasks from "./pages/Tasks"
import Settings from "./pages/Settings"
import Whoami from './pages/Whoami';
import Classedetails from './pages/Classdetails'
import Login from './pages/Login';
import { Container, Alert } from 'react-bootstrap';
import api from './api';
import { useState, useEffect } from 'react';

function App() {
    function PrivateRoute({ children, ...rest }) {
      const token = localStorage.getItem("token");
      const [warn, setWarn] = useState(false);
      useEffect(() => {
          if(token === null || token === '') return;
          api.get('/users/me').then(resp => {
              setWarn(resp.data.rss_url.length == 0 || resp.data.ical_url.length == 0);
          }).catch(err => {
            console.log(err);
          });
      }, []);
      return (<Container>
        {warn && <Alert variant="warning">Warning: RSS URL と iCal URL を <Alert.Link href="settings">Settings</Alert.Link> で設定してください．</Alert>}
        <Route
          {...rest}
          render={({ location }) =>
            (token !== null && token != '') ? (
              children
            ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: location }
                }}
              />
            )
          }
        />
      </Container>);
    }
  return (
    <Router>
      <div className="App">
        <Navbar></Navbar>
        <Switch>
          <PrivateRoute exact path="/">
            <Home />
          </PrivateRoute>

          <PrivateRoute exact path="/tasks">
            <Tasks />
          </PrivateRoute>

          <PrivateRoute exact path="/settings">
            <Settings />
          </PrivateRoute>

          <PrivateRoute path="/me">
            <Whoami />
          </PrivateRoute>

          <Route path="/login">
            <Login/>
          </Route>
          <PrivateRoute path="/classes/:class_id">
            <Classedetails />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

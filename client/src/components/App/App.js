import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Chat from '../TemplateChat/Chat';
import SignIn from '../Join/Join';

function App() {
    return (
        <Router >
            <Switch>
                <Route exact path="/" component={SignIn} />
                <Route exact path="/chat" component={Chat} />
       
                {/*<Route path="/forgetpassword" component={ForgetPassword} />*/}
                <Route  />
            </Switch>
        </Router>
    );
}

export default App;


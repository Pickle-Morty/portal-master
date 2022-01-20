import React, {Component, Fragment} from 'react';
import Routes from './Routes';
import {NotificationContainer} from 'react-notifications';

import './App.css';

class App extends Component {
    render() {
        return (
            <Fragment>
                <NotificationContainer/>
                <Routes user={this.props.user}/>
            </Fragment>
        );
    }
}

export default App;


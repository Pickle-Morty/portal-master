import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Login from './containers/Login/Login';
import Register from './containers/Register/Register';
import Board from './containers/Board/Board';
import Catalog from './containers/Catalog/Catalog';
import PersonalAccount from './containers/PersonalAccount/PersonalAccount';
import TestingCatalog from "./containers/Testing/TestingCatalog";


const Routes = () => {
    return (
        <Switch>
            <Route path='/' exact component={Login} />
            <Route path='/register' exact component={Register} />
            <Route path='/main' exact component={Board} />
            <Route path='/catalog' exact component={Catalog} />
            <Route path='/personal-account' component={PersonalAccount} />
            <Route path='/catalog/user/:userId' exact component={Catalog} />
            <Route path='/catalog/user/:userId' exact component={Catalog} />
            <Route path='/testing-catalog' exact component={TestingCatalog} />
            <Route path='/testing-catalog/user/:userId' exact component={TestingCatalog} />


        </Switch>
    );
};

export default Routes;

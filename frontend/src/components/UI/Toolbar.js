import React, {Fragment} from 'react';
import UserMenu from './Menu/UserMenu';
import {Redirect} from 'react-router-dom';

const Toolbar = ({user, logout}) => {
    return (
        <Fragment>
            {user ? <UserMenu user={user} logout={logout}/> : <Redirect to='/'/>}
        </Fragment>
    );
};

export default Toolbar;

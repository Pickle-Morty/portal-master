import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createBrowserHistory} from 'history';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import {loadFromLocalStorage, saveToLocalStorage} from './localStorage';
import axios from '../axiosBase';
import noticeReducers from './reducers/noticeReducers';
import usersReducers from './reducers/usersReducers';
import adminUsersReducers from './reducers/adminUsersReducers';
import subjectsReducers from './reducers/subjectsReducers';
import dialogReducers from './reducers/dialogReducers';
import messageReducers from './reducers/messageReducers';

export const history = createBrowserHistory();

const rootReducer = combineReducers({
    router: connectRouter(history),
    users: usersReducers,
    notices: noticeReducers,
    adminUsers: adminUsersReducers,
    subjects: subjectsReducers,
    dialogs: dialogReducers,
    messages: messageReducers
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [
    thunkMiddleware,
    routerMiddleware(history)
];

const enhancers = composeEnhancers(applyMiddleware(...middleware));

const persistedState = loadFromLocalStorage();

const store = createStore(rootReducer, persistedState, enhancers);

store.subscribe(() => {
    saveToLocalStorage({
        users: {
            user: store.getState().users.user
        }
    });
});

axios.interceptors.request.use(config => {
    try {
        config.headers['Authorization'] = store.getState().users.user.token;
    } catch(e) {
        // do nothing, user is not logged in
    }

    return config
});

export default store;

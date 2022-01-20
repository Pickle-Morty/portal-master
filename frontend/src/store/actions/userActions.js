import {push} from 'connected-react-router';
import {NotificationManager}  from 'react-notifications';
import axios from '../../axiosBase';

export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';

export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';

export const USER_INFO = 'USER_INFO';

export const LOGOUT_USER = 'LOGOUT_USER';

export const EDIT_USER_SUCCESS = 'EDIT_USER';
export const EDIT_USER_FAILURE = 'EDIT_USER_FAILURE';


const registerUserSuccess = (user) => ({type: REGISTER_USER_SUCCESS, user});
const registerUserFailure = error => ({type: REGISTER_USER_FAILURE, error});

const loginUserSuccess = user => ({type: LOGIN_USER_SUCCESS, user});
const loginUserFailure = error => ({type: LOGIN_USER_FAILURE, error});

const getUserInfo = user => ({type: USER_INFO, user});

export const editUserSuccess = user => ({type: EDIT_USER_SUCCESS, user});
export const editUserFailure = error => ({type: EDIT_USER_FAILURE, error});

export const fetchUserInfo = () => {
    return dispatch => {
        return axios.get('/users').then(
            response => {
                dispatch(getUserInfo(response.data));
            }
        )
    }
};

export const logoutUser = () => {
    return (dispatch, getState) => {
        const token = getState().users.user.token;
        const config = {headers: {'Authorization': token}};

        return axios.delete('/users/sessions', config).then(
            () => {
                dispatch({type: LOGOUT_USER});
                NotificationManager.success('Вы вышли из системы!');
                dispatch(push('/'));
            },
            error => {
                NotificationManager.error('Не возможно авторизоваться, попробуйте позже!')
            }
        )
    }
};

export const registerUser = userData => {
    return dispatch => {
        return axios.post('/users', userData.user).then(
            response => {
                dispatch(registerUserSuccess(response.data.user));
                NotificationManager.success('Регистрация завершена');
                dispatch(push('/main'))
            },
            error => {
                if (error.response && error.response.data) {
                    dispatch(registerUserFailure(error.response.data))
                } else {
                    dispatch(registerUserFailure({global: 'Нет соединения'}))
                }
            }
        )
    }
};

export const loginUser = userData => {
    return dispatch => {
        return axios.post('/users/sessions', userData).then(
            response => {
                dispatch(loginUserSuccess(response.data.user));
                NotificationManager.success('Вы вошли в систему!');
                dispatch(push('/main'));
            }, error => {
                if (error.response) {
                    dispatch(loginUserFailure(error.response.data))
                } else {
                    dispatch(loginUserFailure({global: 'Нет соединения'}))
                }
            }
        )
    }
};

export const editUser = (userData) => {
    return (dispatch, getState) => {
        const token = getState().users.user.token;
        const config = {headers: {'Authorization': token}};
        return axios.put('/users/sessions', userData, config).then(
            () => {
                dispatch(editUserSuccess());
                NotificationManager.success('Данные пользователя изменены');
                dispatch(fetchUserInfo());
            }, error => {
                if (error.response) {
                    dispatch(editUserFailure(error.response.data))
                } else {
                    dispatch(editUserFailure({global: 'Нет соединения'}))
                }
            }
        );
    };
};

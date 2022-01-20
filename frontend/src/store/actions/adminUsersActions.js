import axios from '../../axiosBase';
import {NotificationManager} from 'react-notifications';

export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const PATCH_USER_SUCCESS = 'PATCH_USER_SUCCESS';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

export const fetchUsersSuccess = adminUsers => ({type: FETCH_USERS_SUCCESS, adminUsers});
export const fetchUserSuccess = adminUser => ({type: FETCH_USER_SUCCESS, adminUser});
export const patchUserSuccess = user => ({type: PATCH_USER_SUCCESS, user});
export const createUserSuccess = user => ({type: CREATE_USER_SUCCESS, user});
export const createUserFailure = error => ({type: CREATE_USER_FAILURE, error});

export const fetchAdminUsers = () => {
    return dispatch => {
        return axios.get('/admin/users').then(
            response => {
                dispatch(fetchUsersSuccess(response.data));
            }
        );
    };
};

export const fetchAdminUser = (userId) => {
    return dispatch => {
        return axios.get(`/admin/users/${userId}`).then(
            response => {
                dispatch(fetchUserSuccess(response.data))
            }
        )
    }
};

export const createUser = (userData) => {
    return (dispatch) => {
        return axios.post('/admin/users', userData).then(
            () => {
                dispatch(fetchAdminUsers());
                NotificationManager.success('Пользователь создан');
                dispatch(createUserSuccess());
            }, error => {
                if (error.response) {
                    dispatch(createUserFailure(error.response.data))
                } else {
                    dispatch(createUserFailure({global: 'Нет соединения'}))
                }
            }
        )
    };
};

export const patchUser = (id, role) => {
    return (dispatch) => {
        return axios.patch(`/admin/users/role_change/${id}`, {id, role: role}).then(
            () => {
                dispatch(patchUserSuccess());
                dispatch(fetchAdminUsers());
                NotificationManager.success('Роль пользователя изменена');
            }
        );
    };
};

export const  assignSubjectToTeacher = (userId, subjectId) =>{
    return dispatch => {
        axios.patch(`/admin/users/${userId}`, { appointSubjects: subjectId}).then(
            () => {
                dispatch(patchUserSuccess());
                NotificationManager.success('Предмет назначен на преподавателя');
            },
            error => {
                if (error.response) {
                    NotificationManager.warning('Выберите преподавателя и предмет');
                }
            }
        )
    }
};

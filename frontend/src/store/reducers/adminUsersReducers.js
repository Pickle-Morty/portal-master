import {
    CREATE_USER_FAILURE, FETCH_USER_SUCCESS,
    FETCH_USERS_SUCCESS
} from '../actions/adminUsersActions';

const initialState = {
    adminUsers: [],
    adminUser: [],
    addUserError: null
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USERS_SUCCESS:
            return {...state, adminUsers: action.adminUsers};
        case FETCH_USER_SUCCESS:
            return {...state, adminUser: action.adminUser};
        case CREATE_USER_FAILURE:
            return {...state, addUserError: action.error};
        default:
            return state;
    }
};

export default adminReducer;

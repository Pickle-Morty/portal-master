import {
    CREATE_NOTICE_FAILURE,
    FETCH_NOTICE_SUCCESS,
    SET_CURRENT_PAGE,
    SET_TOTAL_NOTICES
} from '../actions/noticeActions';

const initialState = {
    notices: [],
    noticeError: null,
    noticePerPage: 5,
    currentPage: 1,
    totalNotices: 0
};

const noticeReducers = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_NOTICE_SUCCESS:
            return {
                ...state,
                notices: action.notices};
        case CREATE_NOTICE_FAILURE:
            return {...state, noticeError: action.error};
        case SET_CURRENT_PAGE:
            return {...state, currentPage: action.currentPage};
        case SET_TOTAL_NOTICES:
            return {...state, totalNotices: action.totalNotices};
        default:
            return state;
    }
};

export default noticeReducers;

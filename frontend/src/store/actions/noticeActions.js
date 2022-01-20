import axios from '../../axiosBase';
import {NotificationManager} from "react-notifications";

export const FETCH_NOTICE_SUCCESS = 'FETCH_NOTICE_SUCCESS';
export const CREATE_NOTICE_SUCCESS = 'CREATE_NOTICE_SUCCESS';
export const CREATE_NOTICE_FAILURE = 'CREATE_NOTICE_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_TOTAL_NOTICES = 'SET_TOTAL_NOTICES';

export const fetchNoticeSuccess = notices => ({type: FETCH_NOTICE_SUCCESS, notices});
export const createNoticeSuccess = notice => ({type: CREATE_NOTICE_SUCCESS, notice});
export const createNoticeFailure = error => ({type: CREATE_NOTICE_FAILURE, error});
export const setCurrentPage = currentPage => ({type: SET_CURRENT_PAGE, currentPage});
export const setTotalNotices = totalNotices => ({type: SET_TOTAL_NOTICES, totalNotices});

export const fetchNotice = (pageNumber, noticePerPage) => {
    return dispatch => {
        return axios.get(`/notice?page=${pageNumber}&limit=${noticePerPage}`).then(
            response => {
                dispatch(fetchNoticeSuccess(response.data.notices));
                dispatch(setTotalNotices(response.data.totalNotices));
            }
        );
    };
};

export const createNotice = (noticeData, pageNumber, noticePerPage) => {
    return (dispatch, getState) => {
        const token = getState().users.user.token;
        return axios.post('/notice', noticeData, {headers: {'Authorization': token}}).then(
            () => {
                dispatch(fetchNotice(pageNumber, noticePerPage));
                NotificationManager.success('Объявление создано');
                dispatch(createNoticeSuccess());
            }, error => {
                if (error.response) {
                    console.log('Ошибка', error.response);
                    dispatch(createNoticeFailure(error.response.data));
                } else {
                    dispatch(createNoticeFailure({global: 'Нет соединения'}));
                }
            }
        )
    };
};
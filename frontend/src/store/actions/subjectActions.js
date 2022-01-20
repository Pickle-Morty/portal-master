import axios from '../../axiosBase';
import {push} from 'connected-react-router';
import {NotificationManager} from 'react-notifications';

export const FETCH_SUBJECTS_SUCCESS = 'FETCH_SUBJECTS_SUCCESS';
export const CREATE_SUBJECT_SUCCESS = 'CREATE_SUBJECT_SUCCESS';
export const CREATE_SUBJECT_FAILURE = 'CREATE_SUBJECT_FAILURE';
export const PATCH_SUBJECT_SUCCESS = 'PATCH_SUBJECT_SUCCESS';

export const fetchSubjectsSuccess = subjects => ({type: FETCH_SUBJECTS_SUCCESS, subjects});
export const createSubjectSuccess = subject => ({type: CREATE_SUBJECT_SUCCESS, subject});
export const createSubjectFailure = error => ({type: CREATE_SUBJECT_FAILURE, error});
export const patchSubjectSuccess = subject => ({type: PATCH_SUBJECT_SUCCESS, subject});

export const fetchSubjects = () => {
    return dispatch => {
        return axios.get('/subject').then(
            response => {
                dispatch(fetchSubjectsSuccess(response.data));
            }
        )
    }
};

export const createSubject = subjectData => {
    return dispatch => {
        return axios.post('/subject', subjectData).then(
            () => {
                dispatch(fetchSubjects());
                dispatch(createSubjectSuccess());
                NotificationManager.success('Новая дисциплина создана');
            },
            error => {
                if (error.response) {
                    dispatch(createSubjectFailure(error.response.data));
                } else {
                    dispatch(createSubjectFailure({global: 'Нет соединения'}));
                }
            }
        )
    }
};

export const  addFileToSubject = (subjectId, subjectData) =>{
    return dispatch => {
        axios.patch(`/subject/${subjectId}`, subjectData).then(
            () => {
                dispatch(fetchSubjects());
                dispatch(patchSubjectSuccess());
                NotificationManager.success('Файл добавлен');
                dispatch(push('/catalog'));
            },
            error => {
                if (error.response) {
                    NotificationManager.warning('Файлов должно быть от 1 до 5');
                }
            }
        )
    }
};

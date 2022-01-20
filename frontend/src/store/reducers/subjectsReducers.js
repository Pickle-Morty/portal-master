import {CREATE_SUBJECT_FAILURE, FETCH_SUBJECTS_SUCCESS} from '../actions/subjectActions';

const initialState = {
    subjects: [],
    subjectError: null
};

const subjectsReducers = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SUBJECTS_SUCCESS:
            return {...state, subjects: action.subjects};
        case CREATE_SUBJECT_FAILURE:
            return {...state, subjectError: action.error};
        default:
            return state;
    }
};

export default  subjectsReducers;

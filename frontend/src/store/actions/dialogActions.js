import axios from '../../axiosBase';

export const FETCH_DIALOGS_SUCCESS = 'FETCH_DIALOGS_SUCCESS';
export const FETCH_DIALOG_SUCCESS = 'FETCH_DIALOG_SUCCESS';
export const CREATE_DIALOG_SUCCESS = 'CREATE_DIALOG_SUCCESS';
export const CREATE_DIALOG_FAILURE = 'CREATE_DIALOG_FAILURE';
export const DIALOG_READ_STATUS = 'DIALOG_READ_STATUS';

export const fetchDialogsSuccess = dialogs => ({ type: FETCH_DIALOGS_SUCCESS, dialogs });
export const fetchDialogSuccess = currentDialogId => ({ type: FETCH_DIALOG_SUCCESS, currentDialogId });
export const createDialogSuccess = dialog => ({ type: CREATE_DIALOG_SUCCESS, dialog });
export const createDialogFailure = error => ({ type: CREATE_DIALOG_FAILURE, error });

export const updateReadStatus = (userId, dialogId) => ({
    type: DIALOG_READ_STATUS,
    userId,
    dialogId
});

export const fetchDialogs = () => {
    return dispatch => {
        return axios.get(`/dialog`).then(
            response => {
                dispatch(fetchDialogsSuccess(response.data));
            }
        )
    }
};

export const createDialog = dialogData => {
    return dispatch => {
        return axios.post('/dialog', dialogData).then(
            () => {
                dispatch(createDialogSuccess());
            },
            error => {
                if (error.response) {
                    dispatch(createDialogFailure(error.response.data));
                } else {
                    dispatch(createDialogFailure({ global: 'Нет соединения' }));
                }
            }
        )
    }
};

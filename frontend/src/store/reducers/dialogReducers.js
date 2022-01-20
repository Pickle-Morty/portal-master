import {
    CREATE_DIALOG_FAILURE,
    FETCH_DIALOG_SUCCESS,
    FETCH_DIALOGS_SUCCESS,
    DIALOG_READ_STATUS
} from '../actions/dialogActions';

const initialState = {
    dialogs: [],
    dialogError: null,
    currentDialogId: window.location.pathname.split('personal-account/dialog/')[1],
};

const dialogReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_DIALOGS_SUCCESS:
            return { ...state, dialogs: action.dialogs };
        case FETCH_DIALOG_SUCCESS:
            return { ...state, currentDialogId: action.currentDialogId };
        case DIALOG_READ_STATUS:
            return {
                ...state,
                dialogs: state.dialogs.map(dialog => {
                    if (dialog._id === action.dialogId) {
                        dialog.lastMessage.read = true;
                    }
                    return dialog;
                })
            };
        case CREATE_DIALOG_FAILURE:
            return { ...state, dialogError: action.error };
        default:
            return state;
    }
};

export default dialogReducer;

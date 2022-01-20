import axios from '../../axiosBase';

export const FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS';
export const CREATE_MESSAGE_SUCCESS = 'CREATE_MESSAGE_SUCCESS';
export const ADD_MESSAGE = 'ADD_MESSAGE';

export const fetchMessagesSuccess = messages => ({ type: FETCH_MESSAGES_SUCCESS, messages });
export const createMessageSuccess = message => ({ type: CREATE_MESSAGE_SUCCESS, message });
export const addMessage = message => (dispatch, getState) => {
    const currentDialogId = getState().dialogs.currentDialogId;
    if (currentDialogId === message.dialog._id) {
        dispatch({
            type: ADD_MESSAGE,
            message
        })
    }
};

export const fetchMessagesByDialogId = currentDialogId => {
    return dispatch => {
        return axios.get(`/messages?dialog=${currentDialogId}`).then(
            response => {
                dispatch(fetchMessagesSuccess(response.data));
            }
        )
    }
};

export const createNewMessage = (messageData) => {
    return dispatch => {
        return axios.post('/messages', messageData).then(() => {
            dispatch(createMessageSuccess);
        })
    }
};

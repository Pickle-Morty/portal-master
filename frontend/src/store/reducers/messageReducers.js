import {FETCH_MESSAGES_SUCCESS, ADD_MESSAGE} from '../actions/messageActions';
import {DIALOG_READ_STATUS} from '../actions/dialogActions';

const initialState = {
    messages: []
};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case DIALOG_READ_STATUS:
            return {
                ...state,
                messages: state.messages.map(message => {
                    if (message._id === action.dialogId) {
                        message.read = true;
                    }
                    return message;
                })
            };
        case ADD_MESSAGE:
            return { ...state, messages: [...state.messages, action.message] };
        case FETCH_MESSAGES_SUCCESS:
            return { ...state, messages: action.messages };
        default:
            return state;
    }
};

export default messageReducer;

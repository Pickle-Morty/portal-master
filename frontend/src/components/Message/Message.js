import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import 'moment/locale/ru';
import IconRead from '../IconRead/IconRead';
import {apiURL} from '../../constants';

import './Message.css';

const Message = ({user, isMe, text, attachments, createdAt, read}) => {
    return (
        <div className={classNames('dialog-message', {'message-my': isMe})}>
            <div className='message__header'>
                <span className='message__user-name'>{user.fullName}</span>
                <span className='message__date'><Moment format='LLL' locale='ru'>{createdAt}</Moment></span>
            </div>
            <div className='message__content'>
                <p className='message__text'>
                    {(text && text !== '') &&
                        <span>{text}</span>
                    }
                    {(attachments && attachments !== 'null') &&
                        <a className='message_attachments' href={apiURL + '/uploads/messageFile/' + attachments}>Файл: {attachments}</a>
                    }
                </p>
                <IconRead isMe={isMe} isRead={read} />
            </div>
        </div>
    );
};

Message.defaultProps = {
    user: {},
};

Message.propTypes = {
    user: PropTypes.object,
    text: PropTypes.string,
    date: PropTypes.string,
    isRead: PropTypes.bool,
};

export default Message;

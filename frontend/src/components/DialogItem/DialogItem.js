import React from 'react';
import Moment from 'react-moment';
import 'moment/locale/ru';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import IconRead from '../IconRead/IconRead';

import './DialogItem.css';

const renderLastMessage = (message, user) => {
    let text = '';

    if (!message.text && message.attachments) {
        text = 'прикрепленный файл';
    } else {
        text = message.text;
    }

    return `${message.user._id === user ? 'Вы: ' : ''}${text}`;
};

const DialogItem = ({_id, user, partner, author, read, text, currentDialogId, lastMessage, isMe}) => {
    return (
        <Link to={`/personal-account/dialog/${_id}`} className='dialog__item-link'>
            <span className={classNames('dialogs__item', {
                'dialogs__item--online': partner.isOnline,
                'dialogs__item--selected': currentDialogId === _id     
                })}>
                <span className='dialogs__item-info'>
                    {
                        user && user._id === author._id ?
                            <span className='dialogs__item-info__user-name'>{partner.fullName}</span> :
                            <span className='dialogs__item-info__user-name'>{author.fullName}</span>
                    }
                    <span className='dialogs__item-info__date'><Moment format='DD/MM/YYYY' locale='ru'>{lastMessage.createdAt}</Moment></span>
                </span>
                <span className='dialogs__item-message'>
                    <span className='dialogs__item-message__text'>{renderLastMessage(lastMessage, user._id)}</span>
                    {isMe && <IconRead isMe={isMe} isReaded={lastMessage.read} />}
                    {(lastMessage.read === false && user._id !== lastMessage.user._id) && <span className='dialogs__item-count' />}
                </span>
            </span>
        </Link>
    );
};

export default DialogItem;

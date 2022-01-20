import React from 'react';
import PropTypes from 'prop-types';
import Message from '../Message/Message';

const MessageItems = ({blockRef, messages, user}) => {
    return (
        <div ref={blockRef} className='chat__dialog-messages'>
            {
                messages.length > 0 ? (
                    messages.map(message => (
                        <Message
                            {...message}
                            isMe={user._id === message.user._id}
                            key={message._id}
                        />
                    ))
                ) : <div>Откройте диалог</div>
            }
        </div>
    );
};

MessageItems.propTypes = {
    messages: PropTypes.array
};

export default MessageItems;

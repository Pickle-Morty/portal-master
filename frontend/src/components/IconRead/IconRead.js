import React from 'react';
import PropTypes from 'prop-types';
import readSvg from '../../assets/read.svg';
import noReadSvg from '../../assets/noread.svg';

const IconRead = ({ isMe, isRead }) =>
    (isMe &&
        (isRead ? (
            <img className='message__icon-read' src={readSvg} alt='Read icon' />
        ) : (
            <img
                className='message__icon-read message__icon-read--no'
                src={noReadSvg}
                alt='No read icon'
            />
        ))) ||
    null;

IconRead.propTypes = {
    isMe: PropTypes.bool,
    isRead: PropTypes.bool
};

export default IconRead;

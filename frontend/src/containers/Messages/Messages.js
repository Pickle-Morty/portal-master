import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { fetchMessagesByDialogId, addMessage } from '../../store/actions/messageActions';
import MessagesItems from '../../components/MessageItems/MessageItems';
import socket from '../../core/socket';
import find from 'lodash/find';

const Messages = ({
  fetchMessagesByDialogId,
  currentDialog,
  updateReadStatus,
  currentDialogId,
  messages,
  userId,
  addMessage,
  user }) => {

  const messagesRef = useRef(null);

  const onNewMessage = (message) => {
    addMessage(message);
  };

  useEffect(() => {
    if (currentDialog) {
      fetchMessagesByDialogId(currentDialog._id);
    }

    socket.on('SERVER:NEW_MESSAGE', onNewMessage);

    return () => socket.removeListener('SERVER:NEW_MESSAGE', onNewMessage);
  }, [fetchMessagesByDialogId, currentDialog]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (messagesRef.current !== null) {
      messagesRef.current.scrollTo(0, 999999)
    }
  }, [messages]);

  if (!currentDialog) {
    return <div>Откройте диалог</div>
  }

  return (
    <MessagesItems
      user={user}
      blockRef={messagesRef}
      messages={messages}
    />
  );
};

const mapStateToProps = state => ({
  user: state.users.user,
  currentDialog: find(state.dialogs.dialogs, { _id: state.dialogs.currentDialogId }),
  messages: state.messages.messages,
});

const mapDispatchToProps = dispatch => ({
  fetchMessagesByDialogId: (currentDialogId) => dispatch(fetchMessagesByDialogId(currentDialogId)),
  addMessage: (message) => dispatch(addMessage(message)),

});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Messages));

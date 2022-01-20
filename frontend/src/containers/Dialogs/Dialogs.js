import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {fetchDialogs, updateReadStatus} from '../../store/actions/dialogActions';
import DialogItems from '../../components/DialogItems/DialogItems';
import socket from '../../core/socket';

const Dialogs = ({ fetchDialogs, updateReadStatus, currentDialogId, dialogs, user }) => {
  const [inputValue, setValue] = useState('');
  const [filteredItems, setFilteredItems] = useState(Array.from(dialogs));

  const onChangeInput = (value = '') => {
    setFilteredItems(
      dialogs.filter(
        dialog =>
          dialog.author.fullName.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
          dialog.partner.fullName.toLowerCase().indexOf(value.toLowerCase()) >= 0,
      ),
    );
    setValue(value);
  };

  useEffect(() => {
    if (dialogs.length) {
      onChangeInput();
    }
  }, [dialogs]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchDialogs();

    socket.on('SERVER:DIALOG_CREATED', fetchDialogs);
    socket.on('SERVER:NEW_MESSAGE', fetchDialogs);
    socket.on('SERVER:MESSAGES_READ', updateReadStatus);
    return () => {
      socket.removeListener('SERVER:DIALOG_CREATED', fetchDialogs);
      socket.removeListener('SERVER:NEW_MESSAGE', fetchDialogs);
    };
  }, [fetchDialogs, updateReadStatus]);

  return (
    <DialogItems
      user={user}
      dialogs={filteredItems}
      onSearch={onChangeInput}
      inputValue={inputValue}
      currentDialogId={currentDialogId}
    />
  );
};

const mapStateToProps = state => ({
  user: state.users.user,
  dialogs: state.dialogs.dialogs,
  currentDialogId: state.dialogs.currentDialogId
});

const mapDispatchToProps = dispatch => ({
  fetchDialogs: () => dispatch(fetchDialogs()),
  updateReadStatus : (userId, dialogId) => dispatch(updateReadStatus(userId, dialogId))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dialogs));

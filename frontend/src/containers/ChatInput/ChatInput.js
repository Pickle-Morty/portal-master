import React, {useState} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {createNewMessage} from '../../store/actions/messageActions';
import ChatInputBase from '../../components/ChatInput/ChatInputBase';

const ChatInput = props => {
    const {
      currentDialogId,
      sendMessage,
    } = props;

    const [value, setValue] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');

    if (!currentDialogId) {
      return null;
    }

    const createMessageHandler = event => {
        event.preventDefault();

        const formData = new FormData();

        formData.append('dialog', currentDialogId);
        formData.append('text', value);
        formData.append('attachments', file);

        sendMessage(formData);

        setValue('');
        setFile(null);
        setFileName('')
    };

    return (
      <ChatInputBase
          value={value}
          setValue={setValue}
          sendMessage={createMessageHandler}
          setFile={setFile}
          setFileName={setFileName}
          attachPreview={fileName}
      />
  );
};

const mapStateToProps = state => ({
  user: state.users.user,
  currentDialogId: state.dialogs.currentDialogId,
});

const mapDispatchToProps = dispatch => ({
    sendMessage: messageData => dispatch(createNewMessage(messageData))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatInput));

import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import Messages from '../Messages/Messages';
import Dialogs from '../Dialogs/Dialogs';
import ChatInput from '../ChatInput/ChatInput';
import SideBar from '../Sidebar/SideBar';
import { fetchDialogSuccess } from '../../store/actions/dialogActions';

import './Chat.css'

const Chat = props => {
  const { fetchDialogSuccess, user } = props;

  useEffect(() => {
    const { pathname } = props.location;
    const currentDialogId = pathname.split('/personal-account/dialog/')[1];
    fetchDialogSuccess(currentDialogId);
  }, [props.location, fetchDialogSuccess]);

  return (
    <section className='personal-chat'>
      <div className='chat'>
        <div className='chat__sidebar'>
          <SideBar />
          <Dialogs />
        </div>
        {user && (
          <div className='chat__dialog'>
            <Messages />
            <ChatInput />
          </div>
        )}
      </div>
    </section>
  );
};

const mapStateToProps = state => ({
  user: state.users.user,
});

const mapDispatchToProps = dispatch => ({
  fetchDialogSuccess: currentDialogId => dispatch(fetchDialogSuccess(currentDialogId))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chat));

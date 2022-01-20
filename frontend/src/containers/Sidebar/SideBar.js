import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SidebarBase from '../../components/Sidebar/SidebarBase';
import { fetchAdminUsers } from '../../store/actions/adminUsersActions';
import { createDialog } from '../../store/actions/dialogActions';

const Sidebar = ({ user, adminUsers, fetchAdminUsers, createDialog }) => {

    const [visible, setVisible] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(false);

    useEffect(() => {
        fetchAdminUsers();
    }, [fetchAdminUsers]);

    const onClose = () => {
        setVisible(false);
    };

    const onShow = () => {
        setVisible(true);
    };

    const onChangeTextArea = e => {
        setMessageText(e.target.value);
    };

    const handleSelectUser = (event, selectedUser) => {
        if (selectedUser != null) {
            setSelectedUserId(selectedUser._id);
        }
    };

    const onCreateDialog = event => {
        event.preventDefault();
        const dialogData = {
            partner: selectedUserId,
            text: messageText
        };
        createDialog(dialogData);
        onClose(setMessageText(''), setSelectedUserId(false));
    };

    return (
        <SidebarBase
            user={user}
            visible={visible}
            onClose={onClose}
            onShow={onShow}
            handleSelectUser={handleSelectUser}
            onChangeTextArea={onChangeTextArea}
            onCreateDialog={onCreateDialog}
            messageText={messageText}
            selectedUserId={selectedUserId}
            users={adminUsers}
        />
    );
};

const mapStateToProps = state => ({
    user: state.users.user,
    adminUsers: state.adminUsers.adminUsers
});

const mapDispatchToProps = dispatch => ({
    fetchAdminUsers: () => dispatch(fetchAdminUsers()),
    createDialog: (dialogData) => dispatch(createDialog(dialogData))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sidebar));

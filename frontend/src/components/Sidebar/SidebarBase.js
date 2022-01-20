import React from 'react';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import Autocomplete from '@material-ui/lab/Autocomplete';

import './SidebarBase.css';

const SidebarBase = ({
    user,
    visible,
    messageText,
    selectedUserId,
    users,
    onShow,
    onClose,
    handleSelectUser,
    onChangeTextArea,
    onCreateDialog,
}) => {
    return (
        <div className='chat__sidebar-header'>
            <div className='chat__sidebar-header__wrap'>
                <PeopleAltOutlinedIcon />
                <span>Список диалогов</span>
            </div>
            <PersonAddOutlinedIcon className='chat__sidebar-add-dialog' onClick={onShow} />
            <Dialog onClose={onClose} open={visible} className='add-user-modal'>
                <DialogTitle onClose={onClose} className='header-modal'>
                    Добавить диалог
                    <IconButton aria-label='delete' className='close-modal' onClick={onClose}>
                        <CloseIcon fontSize='large' />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <form className='add-notice-form' onSubmit={onCreateDialog}>
                        <Autocomplete
                            onChange={handleSelectUser}
                            style={{ width: '100%' }}
                            disableClearable
                            options={users}
                            getOptionDisabled={(users) => users._id === user._id}
                            getOptionLabel={users => (users.fullName)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label='Введите имя пользователя'
                                    margin='normal'
                                    variant='outlined'
                                    InputProps={{ ...params.InputProps, type: 'search' }}
                                />
                            )}
                        />
                        {selectedUserId && (
                            <TextField
                                label='Текст сообщения'
                                type='textarea'
                                value={messageText}
                                onChange={onChangeTextArea}
                                variant='outlined'
                                multiline
                                rows={6}
                                rowsMax={6}
                                required
                            />
                        )}
                        <div className='form-button-wrap'>
                            <Button autoFocus type='submit' color='primary'>
                                Добавить
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SidebarBase;

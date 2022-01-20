import React from 'react';
import DialogItem from '../DialogItem/DialogItem';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import './DialogItems.css';

const DialogItems = ({dialogs, user, onSearch, inputValue, currentDialogId}) => {
    return (
        <div>
            <div className='chat__sidebar-search'>
                <TextField
                    variant='outlined'
                    placeholder='Поиск'
                    name='searchUser'
                    value={inputValue}
                    onChange={e => onSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment>
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </div>
            <div className='chat__sidebar-dialogs'>
                {
                    dialogs.length ?
                        dialogs.map(dialog => (
                            <DialogItem
                                key={dialog._id}
                                isMe={dialog.author._id === user}
                                user={user}
                                currentDialogId={currentDialogId}
                                {...dialog}
                            />
                        )) : <div>Диалог не найден</div>
                }
            </div>
        </div>
    );
};

export default DialogItems;

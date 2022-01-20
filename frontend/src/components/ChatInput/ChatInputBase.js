import React, {Fragment} from 'react';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import './ChatInputBase.css';

const ChatInputBase = props => {
    const {value, sendMessage, setValue, attachPreview, setFile, setFileName} = props;
    return (
        <Fragment>
            <form className='chat__dialog-controls' onSubmit={sendMessage}>
                <div className='message-file-preview'>
                    {
                        attachPreview && (
                            <span>Прикрепленный файл: {attachPreview}</span>
                        )
                    }
                </div>
                <div className='chat__dialog-controls-wrap'>
                    <input
                        accept='attachFile/*'
                        type='file'
                        id='upload-file'
                        onChange={e => {
                            e.preventDefault();
                            setFile(e.target.files[0]);
                            setFileName(e.target.files[0].name);
                        }}
                        style={{ display: 'none', }}
                    />
                    <label htmlFor='upload-file' className='message-file-upload'>
                        <Button
                            component='span'
                            startIcon={<AttachFileOutlinedIcon />}
                        >Файл</Button>
                    </label>
                    <TextField
                        placeholder='Напишите сообщение'
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        autoComplete='off'
                        inputProps={{
                            maxLength: 300
                        }}
                    />
                </div>
                <Button type='submit'>Отправить</Button>
            </form>
        </Fragment>
    );
};

export default ChatInputBase;

import React, {Component, Fragment} from 'react';
import Moment from 'react-moment';
import 'moment/locale/ru';
import {connect} from 'react-redux';
import {apiURL} from '../../constants';
import {withRouter} from 'react-router-dom';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import Toolbar from '../../components/UI/Toolbar';
import {createNotice, fetchNotice, setCurrentPage} from '../../store/actions/noticeActions';
import {logoutUser} from '../../store/actions/userActions';
import PaginationBlock from '../../components/Pagination/Pagination';

import './Board.css';

class Board extends Component {
    state = {
        title: '',
        description: '',
        noticeFile: [],
        fileName: [],
        addNoticeModal: false,
    };

    componentDidMount() {
        this.props.fetchNotice(this.props.currentPage, this.props.noticePerPage);
    }

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    openNoticeModal = () => {
        this.setState({addNoticeModal: true});
    };
    closeNoticeModal = () => {
        this.setState({addNoticeModal: false, title: '', description: '', noticeFile: [], fileName: []});
    };

    noticeChangeHandler = event => {
        event.preventDefault();

        let files = Array.from(event.target.files);

        files.forEach((file) => {
            let reader = new FileReader();
            reader.onloadend = () => {
                this.setState({
                    noticeFile: [...this.state.noticeFile, file],
                    fileName: [...this.state.fileName, file.name]
                });
            };
            reader.readAsDataURL(file);
        });
    };

    submitFormHandler = event => {
        event.preventDefault();
        const formData = new FormData();

        for (let i = 0; i < this.state.noticeFile.length; i++) {
            formData.append('noticeFile', this.state.noticeFile[i]);
        }

        Object.keys(this.state).forEach(key => {
            if (!['noticeFile'].includes(key)) {
                formData.append(key, this.state[key]);
            }
        });

        this.props.createdNotice(formData, this.props.currentPage, this.props.noticePerPage);

        if (this.state.title !== '') {
            this.closeNoticeModal();
        }
    };

    onPageChanged = pageNumber => {
        this.props.setCurrentPage(pageNumber);
        this.props.fetchNotice(pageNumber, this.props.noticePerPage);
    };

    getFieldError = fieldName => {
        return this.props.error && this.props.error.errors && this.props.error.errors[fieldName]
            && (this.props.error.errors[fieldName].message)
    };

    render() {
        let noticeCard = null;
        if (this.props.notices) {
            noticeCard = this.props.notices.map(notice => {
                return (
                    <div className='board-post' key={notice._id}>
                        <div className='board-post__top'>
                            <span>{notice.user.secondName} {notice.user.firstName}</span>
                            <span><Moment format='LLL' locale='ru'>{notice.dateTime}</Moment></span>
                        </div>
                        <h4 className='board-post__title'>{notice.title}</h4>
                        <p className='board-post__desc'>{notice.description}</p>
                        <div className='board-post-file'>
                            {
                                notice.noticeFile.map(file => {
                                    return (
                                        <a href={apiURL + '/uploads/notice/' + file} key={file}>{file}</a>
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            })
        }
        return (
            <Fragment>
                <Toolbar
                    user={this.props.user}
                    logout={this.props.logoutUser}
                />
                <div className='main-board'>
                    <div className='container'>
                        <div className='top'>
                            <h4 className='top__title'>Доска</h4>
                            {
                                this.props.user && this.props.user.role === 'admin' &&
                                <Button className='top__btn common-btn' onClick={this.openNoticeModal}>+ Добавить объявление</Button>
                            }
                        </div>
                        <Dialog onClose={this.closeNoticeModal} open={this.state.addNoticeModal} className='add-user-modal'>
                            <DialogTitle onClose={this.closeNoticeModal} className='header-modal'>
                                Добавить объявление
                                <IconButton aria-label='delete' className='close-modal' onClick={this.closeNoticeModal}>
                                    <CloseIcon fontSize='large' />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent>
                                <form className='add-notice-form' onSubmit={this.submitFormHandler}>
                                    <TextField
                                        label='Заголовок *'
                                        type='text'
                                        value={this.state.title}
                                        name="title"
                                        onChange={this.inputChangeHandler}
                                        helperText={this.getFieldError('title')}
                                        variant='outlined'
                                    />
                                    <TextField
                                        label='Текст объявления'
                                        type='textarea'
                                        value={this.state.description}
                                        name='description'
                                        onChange={this.inputChangeHandler}
                                        helperText={this.getFieldError('description')}
                                        variant='outlined'
                                        multiline
                                        rows={6}
                                        rowsMax={6}
                                    />
                                    <div className='file-preview'>
                                        {
                                            this.state.fileName.map((file) => {
                                                return (
                                                    <span key={file}>{file}</span>
                                                )
                                            })
                                        }
                                    </div>
                                    <input
                                        accept='noticeFile/*'
                                        type='file'
                                        multiple
                                        id='upload-file'
                                        onChange={this.noticeChangeHandler}
                                        style={{ display: 'none', }}
                                    />
                                    {
                                        this.state.fileName.length === 0 ?
                                            <label htmlFor='upload-file' className='upload-file'>
                                                <Button
                                                    component='span'
                                                    startIcon={<AttachFileIcon />}
                                                >
                                                    Прикрепить файл
                                                </Button>
                                            </label> :
                                            <label htmlFor='upload-file' className='upload-file catalog-upload-file add-new-file'>
                                                <Button
                                                    component='span'
                                                >
                                                    + Добавить файл
                                                </Button>
                                            </label>
                                    }

                                    <div className='form-button-wrap'>
                                        <Button autoFocus type='submit' color='primary'>
                                            Сохранить
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                        {
                            this.props.notices.length !== 0 ?
                                <div className='board-posts'>
                                    {noticeCard}
                                </div> : <div className='board-posts-empty'>Список объявлейний пуст</div>
                        }
                        <PaginationBlock
                            totalNotices = {this.props.totalNotices}
                            noticePerPage = {this.props.noticePerPage}
                            currentPage = {this.props.currentPage}
                            onPageChanged = {this.onPageChanged}
                        />
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    user: state.users.user,
    error: state.notices.noticeError,
    notices: state.notices.notices,
    noticePerPage: state.notices.noticePerPage,
    currentPage: state.notices.currentPage,
    totalNotices: state.notices.totalNotices
});

const mapDispatchToProps = dispatch => ({
    logoutUser: () => dispatch(logoutUser()),
    createdNotice: (noticeData, pageNumber, noticePerPage) => dispatch(createNotice(noticeData, pageNumber, noticePerPage)),
    fetchNotice: (pageNumber, noticePerPage) => dispatch(fetchNotice(pageNumber, noticePerPage)),
    setCurrentPage: pageNumber => dispatch (setCurrentPage(pageNumber)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Board));

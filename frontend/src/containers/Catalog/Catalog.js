import React, {Component, Fragment} from 'react';

import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import Toolbar from '../../components/UI/Toolbar';
import {logoutUser} from '../../store/actions/userActions';
import {addFileToSubject, fetchSubjects} from '../../store/actions/subjectActions';
import {fetchAdminUser, fetchAdminUsers} from '../../store/actions/adminUsersActions';

import './Catalog.css';
import '../Board/Board.css';
import {apiURL} from '../../constants';

class Catalog extends Component {
    state = {
        subject: '',
        materials: [],
        fileName: [],
        addCatalogModal: false,
        userId: '',
    };

    componentDidMount() {
        this.props.onFetchSubjects();
        this.props.onFetchUsers();
    }

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    subjectFilesHandler = event => {
        event.preventDefault();

        let files = Array.from(event.target.files);

        files.forEach((file) => {
            let reader = new FileReader();
            reader.onloadend = () => {
                this.setState({
                    materials: [...this.state.materials, file],
                    fileName: [...this.state.fileName, file.name]
                });
            };
            reader.readAsDataURL(file);
        });
    };

    openCatalogModal = () => {
        this.setState({addCatalogModal: true});
    };

    closeCatalogModal = () => {
        this.setState({addCatalogModal: false, subject: '', materials: [], fileName: []});
    };

    getUserDataById = async (event) => {
        event.preventDefault();
         await this.setState({userId: event.target.id});

        await this.props.onFetchUser(this.state.userId);
    };

    submitFormHandler = event => {
        event.preventDefault();
        const formData = new FormData();

        for (let i = 0; i < this.state.materials.length; i++) {
            formData.append('materials', this.state.materials[i]);
        }

        this.props.addFileToSubject(this.state.subject, formData);

        if (this.state.fileName.length !== 0) {
            this.closeCatalogModal();
        }
    };

    render() {
        let subjectItem = null;
        if (this.props.adminUser.appointSubjects) {
            subjectItem = this.props.adminUser.appointSubjects.map(subject => {
                return (
                    <div className='right-column-subject' key={subject._id}>
                        <h5 className='right-column-subject__title'>{subject.subject}</h5>
                        {
                            subject.materials.map(file => {
                                return (
                                    <a className='right-column-subject__name' href={apiURL + '/uploads/subject/' + file} key={file}>{file}</a>
                                )
                            })
                        }
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
                <div className='main-catalog'>
                    <div className='container'>
                        <div className='top'>
                            <h4 className='top__title'>Каталог учебных материалов</h4>
                            <Button className='top__btn common-btn' onClick={this.openCatalogModal}>+ Добавить материал</Button>
                        </div>
                        <Dialog onClose={this.closeCatalogModal} open={this.state.addCatalogModal} className='add-user-modal'>
                        <DialogTitle onClose={this.closeCatalogModal} className='header-modal'>
                            Добавить материал
                            <IconButton aria-label='delete' className='close-modal' onClick={this.closeCatalogModal}>
                                <CloseIcon fontSize='large' />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <form className='add-notice-form' onSubmit={this.submitFormHandler}>
                                <FormControl variant='outlined'>
                                    <Select
                                        native
                                        value={this.state.subject}
                                        onChange={this.inputChangeHandler}
                                        inputProps={{
                                            name: 'subject',
                                        }}
                                    >
                                        <option value='' disabled>Предмет</option>
                                        {
                                            this.props.subjects.map(subject => {
                                                return (
                                                    <option value={subject._id} key={subject._id}>{subject.subject}</option>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
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
                                    accept='file/*'
                                    type='file'
                                    id='upload-file'
                                    onChange={this.subjectFilesHandler}
                                    style={{ display: 'none', }}
                                    multiple
                                />
                                {
                                    this.state.fileName.length === 0 ?
                                        <label htmlFor='upload-file' className='upload-file catalog-upload-file'>
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
                                <span className='notification-text'>Максимальное число файлов для загрузки равно 5</span>
                                <div className='form-button-wrap'>
                                    <Button autoFocus color='primary' type='submit'>
                                        Сохранить
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                        <div className='catalog-block'>
                            <div className='left-column'>
                                <h5 className='left-column__title'>Преподаватели</h5>
                                <ul className='teacher-list'>
                                    {
                                        this.props.adminUsers
                                            .filter(user => user.role === 'teacher' || user.role === 'admin')
                                            .map(user => {
                                                return (
                                                    <li className='teacher-list__item' key={user._id}>
                                                        <span id={user._id} className='teacher-list__link' onClick={this.getUserDataById}>{user.secondName} {user.firstName} {user.lastName}</span>
                                                    </li>
                                                )
                                            })
                                    }
                                </ul>
                            </div>
                            <div className='right-column'>
                                {subjectItem}
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    user: state.users.user,
    subjects: state.subjects.subjects,
    adminUsers: state.adminUsers.adminUsers,
    adminUser: state.adminUsers.adminUser,
});

const mapDispatchToProps = dispatch => ({
    logoutUser: () => dispatch(logoutUser()),
    onFetchSubjects: () => dispatch(fetchSubjects()),
    onFetchUsers: () => dispatch(fetchAdminUsers()),
    onFetchUser: userId => dispatch(fetchAdminUser(userId)),
    addFileToSubject: (subjectId, subjectData) => dispatch(addFileToSubject(subjectId, subjectData)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Catalog));

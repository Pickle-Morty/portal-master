import React, {Component, Fragment} from 'react';

import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

import {createSubject, fetchSubjects} from '../../store/actions/subjectActions';
import {assignSubjectToTeacher, fetchAdminUsers} from '../../store/actions/adminUsersActions';

import './Subjects.css';

class SubjectsList extends Component {
    state = {
        subject: '',
        appointSubjects: '',
        teacher: '',
        addSubjectModal: false,
        appointTeacherModal: false,
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

    openSubjectModal = () => {
        this.setState({addSubjectModal: true});
    };

    openTeacherModal = () => {
        this.setState({appointTeacherModal: true});
    };

    closeSubjectModal = () => {
        this.setState({addSubjectModal: false, subject: ''});
    };

    closeTeacherModal = () => {
        this.setState({appointTeacherModal: false, appointSubjects: '', teacher: ''});
    };

    submitSubjectHandler = event => {
        event.preventDefault();

        const subjectData = {
            subject: this.state.subject
        };

        this.props.createSubject(subjectData);

        if (this.state.subject !== '') {
            this.closeSubjectModal();
        }
    };

    submitTeacherSubjectHandler = event => {
        event.preventDefault();

        this.props.assignSubjectToTeacher(this.state.teacher, this.state.appointSubjects);

        if (this.state.appointSubjects !== '' && this.state.teacher !== '') {
            this.closeTeacherModal();
        }
    };

    render() {
        let subjectItem = null;
        if (this.props.subjects) {
            subjectItem = this.props.subjects.map(subject => {
                return (
                    <li className='subjects__item' key={subject._id}>
                        <span>{subject.subject}</span>
                    </li>
                )
            })
        }
        return (
            <Fragment>
                <div className='subjects'>
                    {
                        this.props.subjects.length !== 0 ?
                            <ul className='subjects__list'>
                                {subjectItem}
                            </ul> : <div className='subjects-list-empty'>Список дисциплин пуст</div>
                    }
                    <div className='subjects-controls'>
                        {
                            this.props.user && this.props.user.role === 'admin' &&
                            <Fragment>
                                <Button className='subjects-controls__btn' onClick={this.openSubjectModal}>+ Добавить предмет</Button>
                                <Button className='subjects-controls__btn' onClick={this.openTeacherModal}>Назначить преподавателя</Button>
                            </Fragment>
                        }
                    </div>
                </div>
                <Dialog onClose={this.closeSubjectModal} open={this.state.addSubjectModal} className='add-subject-modal subject-modal'>
                    <DialogTitle onClose={this.closeSubjectModal} className='header-modal'>
                        Добавить предмет
                        <IconButton aria-label='delete' className='close-modal' onClick={this.closeSubjectModal}>
                            <CloseIcon fontSize='large' />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <form className='add-subject-form subject-form' onSubmit={this.submitSubjectHandler}>
                            <TextField
                                label='Предмет'
                                type='text'
                                value={this.state.subject}
                                name='subject'
                                onChange={this.inputChangeHandler}
                                className='add'
                                variant='outlined'
                                required
                            />
                            <Button autoFocus color='primary' type='submit'>
                                Добавить
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <Dialog onClose={this.closeTeacherModal} open={this.state.appointTeacherModal} className='appoint-teacher-modal subject-modal'>
                    <DialogTitle onClose={this.closeTeacherModal} className='header-modal'>
                        Добавить предмет
                        <IconButton aria-label='delete' className='close-modal' onClick={this.closeTeacherModal}>
                            <CloseIcon fontSize='large' />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <form className='appoint-teacher-form subject-form' onSubmit={this.submitTeacherSubjectHandler}>
                            <FormControl variant='outlined'>
                                <Select
                                    native
                                    value={this.state.appointSubjects}
                                    onChange={this.inputChangeHandler}
                                    inputProps={{
                                        name: 'appointSubjects',
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
                            <FormControl variant='outlined'>
                                <Select
                                    native
                                    value={this.state.teacher}
                                    onChange={this.inputChangeHandler}
                                    inputProps={{
                                        name: 'teacher',
                                    }}
                                >
                                    <option value='' disabled>Преподователь</option>
                                    {
                                        this.props.adminUsers
                                            .filter(user => user.role === 'teacher' || user.role === 'admin')
                                            .map(user => {
                                                return (
                                                    <option value={user._id} key={user._id}>{user.fullName}</option>
                                                )
                                            })
                                    }
                                </Select>
                            </FormControl>
                            <Button autoFocus color='primary' type='submit'>
                                Сохранить
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    user: state.users.user,
    subjects: state.subjects.subjects,
    adminUsers: state.adminUsers.adminUsers
});

const mapDispatchToProps = dispatch => ({
    onFetchSubjects: () => dispatch(fetchSubjects()),
    onFetchUsers: () => dispatch(fetchAdminUsers()),
    createSubject: subjectData => dispatch(createSubject(subjectData)),
    assignSubjectToTeacher: (userId, subjectId) => dispatch(assignSubjectToTeacher(userId, subjectId))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SubjectsList));

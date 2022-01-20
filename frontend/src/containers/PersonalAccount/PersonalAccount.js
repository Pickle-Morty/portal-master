import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {NotificationManager} from 'react-notifications';

import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';

import Toolbar from '../../components/UI/Toolbar';
import Chat from '../Chat/Chat';
import Users from '../../components/Users/Users';
import Subjects from '../../components/Subjects/Subjects';
import SubjectsList from '../../components/Subjects/SubjectsList';
import {editUser, logoutUser} from '../../store/actions/userActions';

import './PersonalAccount.css';

class PersonalAccount extends Component {
    state = {
        email: this.props.user.email,
        secondName: this.props.user.secondName,
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        password: '',
        secondPassword: '',
        editProfileModal: false,
    };

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    openEditProfileModal = () => {
        this.setState({editProfileModal: true});
    };

    closeEditProfileModal = () => {
        this.setState({
            editProfileModal: false,
            email: this.props.user.email,
            firstName: this.props.user.firstName,
            lastName: this.props.user.lastName,
            secondName: this.props.user.secondName,
            password: '',
            secondPassword: ''
        });
    };

    submitEditProfileModalHandler = event => {
        event.preventDefault();

        if (this.state.password !== this.state.secondPassword) {
            NotificationManager.error('Пароли не совподают!');
        } else {
            const editProfileData = {
                email: this.state.email,
                secondName: this.state.secondName,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                password: this.state.password,
            };

            this.props.editUser(editProfileData);
            this.closeEditProfileModal();
        }
    };

    getFieldError = fieldName => {
        return this.props.error && this.props.error.errors && this.props.error.errors[fieldName]
            && (this.props.error.errors[fieldName].message)
    };

    render() {
        return (
            <Fragment>
                <Toolbar
                    user={this.props.user}
                    logout={this.props.logoutUser}
                />
                <div className='personal-block'>
                    <div className='container'>
                        <div className='top'>
                            {
                                this.props.user &&
                                <h4 className='top__title'>{this.props.user.fullName}</h4>
                            }
                            <Button className='top__btn common-btn edit-btn' onClick={this.openEditProfileModal}>
                                Редактировать
                            </Button>
                            <Dialog onClose={this.closeEditProfileModal} open={this.state.editProfileModal} className='add-user-modal'>
                                <DialogTitle onClose={this.closeEditProfileModal} className='header-modal'>
                                    Редактировать пользователя
                                    <IconButton aria-label='delete' className='close-modal' onClick={this.closeEditProfileModal}>
                                        <CloseIcon fontSize='large' />
                                    </IconButton>
                                </DialogTitle>
                                <DialogContent>
                                    <form className='add-user-form' onSubmit={this.submitEditProfileModalHandler}>
                                        <TextField
                                            label='E-mail'
                                            type='email'
                                            value={this.state.email}
                                            name='email'
                                            onChange={this.inputChangeHandler}
                                            helperText={this.getFieldError('email')}
                                            className='add-user-form__input'
                                        />
                                        <TextField
                                            label='Фамилия'
                                            type='text'
                                            name='secondName'
                                            value={this.state.secondName}
                                            onChange={this.inputChangeHandler}
                                            helperText={this.getFieldError('secondName')}
                                            className='add-user-form__input'
                                        />
                                        <TextField
                                            label='Имя'
                                            type='text'
                                            name='firstName'
                                            value={this.state.firstName}
                                            onChange={this.inputChangeHandler}
                                            helperText={this.getFieldError('firstName')}
                                            className='add-user-form__input'
                                        />
                                        <TextField
                                            label='Отчетсво'
                                            type='text'
                                            name='lastName'
                                            value={this.state.lastName}
                                            onChange={this.inputChangeHandler}
                                            helperText={this.getFieldError('lastName')}
                                            className='add-user-form__input'
                                        />
                                        <TextField
                                            label='Пароль'
                                            type='password'
                                            name='password'
                                            value={this.state.password}
                                            onChange={this.inputChangeHandler}
                                            helperText={this.getFieldError('password')}
                                            className='add-user-form__input'
                                            required
                                        />
                                        <TextField
                                            label='Повторите пароль'
                                            type='password'
                                            name='secondPassword'
                                            value={this.state.secondPassword}
                                            onChange={this.inputChangeHandler}
                                            className='add-user-form__input'
                                            required
                                        />
                                        <Button autoFocus color='primary' type='submit'>
                                            Сохранить
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className='personal-menu'>
                            <Tabs>
                                <TabList className='personal-menu__list'>
                                    <Tab className='personal-menu__item'>Чат</Tab>
                                    {
                                        this.props.user && this.props.user.role === 'admin' &&
                                        <Tab className='personal-menu__item'>Список пользователей</Tab>
                                    }
                                    {
                                        this.props.user && (this.props.user.role === 'admin' || this.props.user.role === 'teacher') &&
                                        <Tab className='personal-menu__item'>Мои дисциплины</Tab>
                                    }
                                    {
                                        this.props.user && this.props.user.role === 'admin' &&
                                        <Tab className='personal-menu__item'>Список дисциплин</Tab>
                                    }
                                </TabList>
                                <TabPanel>
                                    <Chat/>
                                </TabPanel>
                                {
                                    this.props.user && this.props.user.role === 'admin' &&
                                    <TabPanel>
                                        <Users/>
                                    </TabPanel>
                                }
                                {
                                    this.props.user && (this.props.user.role === 'admin' || this.props.user.role === 'teacher') &&
                                    <TabPanel>
                                        <Subjects/>
                                    </TabPanel>
                                }
                                {
                                    this.props.user && this.props.user.role === 'admin' &&
                                    <TabPanel>
                                        <SubjectsList/>
                                    </TabPanel>
                                }
                            </Tabs>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    user: state.users.user,
    error: state.users.editUserError,
});

const mapDispatchToProps = dispatch => ({
    logoutUser: () => dispatch(logoutUser()),
    editUser: userData => dispatch(editUser(userData))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PersonalAccount));

import React, {Component, Fragment} from 'react';

import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {NotificationManager} from 'react-notifications';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';

import {createUser, fetchAdminUsers, patchUser} from '../../store/actions/adminUsersActions';

import './Users.css';

class Users extends Component {
    state = {
        email: '',
        secondName: '',
        firstName: '',
        lastName: '',
        password: '',
        secondPassword: '',
        role: '',
        addUserModal: false,
        searchUser: '',
    };

    componentDidMount() {
        this.props.onFetchUsers();
    }

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    radioChangeHandler = event => {
        this.setState({role: event.target.value})
    };

    openUserModal = () => {
        this.setState({addUserModal: true});
    };

    closeUserModal = () => {
        this.setState({addUserModal: false, email: '', secondName: '', firstName: '', lastName: '', password: '', secondPassword: '', role: ''});
    };

    submitUserHandler = event => {
        event.preventDefault();

        if (this.state.password !== this.state.secondPassword) {
            NotificationManager.error('Пароли не совподают!');
        } else {
            const userData = {
                email: this.state.email,
                secondName: this.state.secondName,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                password: this.state.password,
                role: this.state.role,
            };
            this.props.createUser(userData);

            if (this.state.email !== '' && this.state.secondName !== '' && this.state.firstName !== '' && this.state.lastName !== '' && this.state.password !== '' && this.state.role !== '') {
                this.closeUserModal();
            }
        }
    };

    getFieldError = fieldName => {
        return this.props.error && this.props.error.errors && this.props.error.errors[fieldName]
            && (this.props.error.errors[fieldName].message)
    };

    render() {
        let filteredUsers = this.props.adminUsers.filter(user => {
            return (
                user.fullName.toLowerCase().indexOf(this.state.searchUser.toLowerCase()) !== -1
            )
        });
        return (
            <Fragment>
                <div className='users'>
                    <div className='users__controls'>
                        <TextField
                            variant='outlined'
                            placeholder='Поиск'
                            value={this.state.searchUser}
                            name='searchUser'
                            onChange={this.inputChangeHandler}
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
                        <Button onClick={this.openUserModal}>+ Добавить пользователя</Button>
                    </div>
                    <div className='users-list'>
                        {
                            filteredUsers.map(user => {
                                return (
                                    <div className='user-row' key={user._id}>
                                        <div className='user-column user-column-left'>
                                            <span className='user-name'>{user.secondName} {user.firstName} {user.lastName}</span>
                                        </div>
                                        <div className='user-column'>
                                            <RadioGroup aria-label='roles' name='roles' row>
                                                <FormControlLabel
                                                    value='teacher'
                                                    control={<Radio color='primary' />}
                                                    checked={user.role === 'teacher'}
                                                    disabled={this.props.user._id === user._id}
                                                    onChange={() => this.props.onUserPatch(user._id, 'teacher')}
                                                    label='Преподаватель'
                                                    labelPlacement='end'
                                                />
                                                <FormControlLabel
                                                    value='student'
                                                    control={<Radio color='primary' />}
                                                    checked={user.role === 'student'}
                                                    disabled={this.props.user._id === user._id}
                                                    onChange={() => this.props.onUserPatch(user._id, 'student')}
                                                    label='Студент'
                                                    labelPlacement='end'
                                                />
                                                <FormControlLabel
                                                    value='admin'
                                                    control={<Radio color='primary' />}
                                                    checked={user.role === 'admin'}
                                                    disabled={this.props.user._id === user._id}
                                                    onChange={() => this.props.onUserPatch(user._id, 'admin')}
                                                    label='Администратор'
                                                    labelPlacement='end'
                                                />
                                            </RadioGroup>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <Dialog onClose={this.closeUserModal} open={this.state.addUserModal} className='add-user-modal'>
                    <DialogTitle onClose={this.closeUserModal} className='header-modal'>
                        Добавить пользователя
                        <IconButton aria-label='delete' className='close-modal' onClick={this.closeUserModal}>
                            <CloseIcon fontSize='large' />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <form className='add-user-form' onSubmit={this.submitUserHandler}>
                            <TextField
                                label='E-mail'
                                type='email'
                                value={this.state.email}
                                name='email'
                                onChange={this.inputChangeHandler}
                                helperText={this.getFieldError('email')}
                                className='add-user-form__input'
                                required
                            />
                            <TextField
                                label='Фамилия'
                                type='text'
                                name='secondName'
                                value={this.state.secondName}
                                onChange={this.inputChangeHandler}
                                helperText={this.getFieldError('secondName')}
                                className='add-user-form__input'
                                required
                            />
                            <TextField
                                label='Имя'
                                type='text'
                                name='firstName'
                                value={this.state.firstName}
                                onChange={this.inputChangeHandler}
                                helperText={this.getFieldError('firstName')}
                                className='add-user-form__input'
                                required
                            />
                            <TextField
                                label='Отчетсво'
                                type='text'
                                name='lastName'
                                value={this.state.lastName}
                                onChange={this.inputChangeHandler}
                                helperText={this.getFieldError('lastName')}
                                className='add-user-form__input'
                                required
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
                            <h4 className='add-user-roles'>Права доступа</h4>
                            <RadioGroup aria-label='roles' name='role' row>
                                <FormControlLabel
                                    value='teacher'
                                    control={<Radio color='primary' />}
                                    onChange={this.radioChangeHandler}
                                    label='Преподаватель'
                                    labelPlacement='end'
                                />
                                <FormControlLabel
                                    value='student'
                                    control={<Radio color='primary' />}
                                    onChange={this.radioChangeHandler}
                                    label='Студент'
                                    labelPlacement='end'
                                />
                                <FormControlLabel
                                    value='admin'
                                    control={<Radio color='primary' />}
                                    onChange={this.radioChangeHandler}
                                    label='Администратор'
                                    labelPlacement='end'
                                />
                            </RadioGroup>
                            <Button autoFocus color='primary' type='submit'>
                                Добавить
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
    error: state.adminUsers.addUserError,
    adminUsers: state.adminUsers.adminUsers
});

const mapDispatchToProps = dispatch => ({
    onFetchUsers: () => dispatch(fetchAdminUsers()),
    onUserPatch: (id, role) => dispatch(patchUser(id, role)),
    createUser: userData => dispatch(createUser(userData)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Users));

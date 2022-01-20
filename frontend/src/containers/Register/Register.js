import React, {Component} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {registerUser} from '../../store/actions/userActions';

import '../Login/Login.css'

class Register extends Component {
    state = {
      email: '',
      secondName: '',
      firstName: '',
      lastName: '',
      password: '',
      secondPassword: ''
    };

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    submitFormHandler = event => {
        event.preventDefault();
         if (this.state.password !== this.state.secondPassword) {
            NotificationManager.error('Пароли не совподают!');
        } else {
            const user = {
                email: this.state.email,
                secondName: this.state.secondName,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                password: this.state.password
            };
            this.props.registerUser({user})
        }
    };

    getFieldError = fieldName => {
        return this.props.error && this.props.error.errors && this.props.error.errors[fieldName]
            && (this.props.error.errors[fieldName].message)
    };

    render() {
        return (
            <div className='main-backdrop'>
                <div className='auth-wrap'>
                    <div className='auth-title'>
                        <h4 className='title'>Информационный портал кафедры ИСТТ</h4>
                    </div>
                    <div className='auth-nav'>
                        <nav className='auth-menu'>
                            <Link component={RouterLink} to='/' className='auth-menu__link'>Вход</Link>
                            <Link component={RouterLink} to='/register' className='auth-menu__link auth-menu__link-active'>Регистрация</Link>
                        </nav>
                    </div>
                    <form className='auth-form' onSubmit={this.submitFormHandler}>
                        <TextField
                            label='E-mail'
                            type='email'
                            value={this.state.email}
                            name='email'
                            onChange={this.inputChangeHandler}
                            helperText={this.getFieldError('email')}
                            className='auth-form__input'
                        />
                        <TextField
                            label='Фамилия'
                            type='text'
                            value={this.state.secondName}
                            name='secondName'
                            onChange={this.inputChangeHandler}
                            helperText={this.getFieldError('secondName')}
                            className='auth-form__input'
                        />
                        <TextField
                            label='Имя'
                            type='text'
                            value={this.state.firstName}
                            name='firstName'
                            onChange={this.inputChangeHandler}
                            helperText={this.getFieldError('firstName')}
                            className='auth-form__input'
                        />
                        <TextField
                            label='Отчетсво'
                            type='text'
                            value={this.state.lastName}
                            name='lastName'
                            onChange={this.inputChangeHandler}
                            helperText={this.getFieldError('lastName')}
                            className='auth-form__input'
                        />
                        <TextField
                            label='Пароль'
                            type='password'
                            value={this.state.password}
                            name='password'
                            onChange={this.inputChangeHandler}
                            helperText={this.getFieldError('password')}
                            className='auth-form__input'
                        />
                        <TextField
                            label='Повторите пароль'
                            type='password'
                            value={this.state.secondPassword}
                            name='secondPassword'
                            onChange={this.inputChangeHandler}
                            className='auth-form__input'
                        />
                        <button className='btn auth-login' type='submit'>Зарегистрироваться</button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    error: state.users.registerError,
});

const mapDispatchToProps = dispatch => ({
    registerUser: userData => dispatch(registerUser(userData))
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);

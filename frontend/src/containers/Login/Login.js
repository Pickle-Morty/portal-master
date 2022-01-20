import React, {Component} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import {connect} from 'react-redux';
import {loginUser} from '../../store/actions/userActions';
import Alert from '@material-ui/lab/Alert';

import './Login.css'

class Login extends Component {
    state = {
        email: '',
        password: '',
    };

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    submitFormHandler = event => {
        event.preventDefault();
        this.props.loginUser({...this.state})
    };

    render() {
        return (
            <div className='main-backdrop'>
                <div className='auth-wrap'>
                    <div className='auth-title'>
                        <h4 className='title'>Информационный портал кафедры ИСТТ</h4>
                    </div>
                    {this.props.error &&  (
                        <Alert severity='error'>{this.props.error.error || this.props.error.global}</Alert>
                    )}
                    <div className='auth-nav'>
                        <nav className='auth-menu'>
                            <Link component={RouterLink} to='/' className='auth-menu__link auth-menu__link-active'>Вход</Link>
                            <Link component={RouterLink} to='/register' className='auth-menu__link'>Регистрация</Link>
                        </nav>
                    </div>
                    <form className='auth-form' onSubmit={this.submitFormHandler}>
                        <TextField
                            label='E-mail'
                            type='email'
                            name='email'
                            value={this.state.email}
                            onChange={this.inputChangeHandler}
                            className='auth-form__input'
                        />
                        <TextField
                            label='Пароль'
                            type='password'
                            name='password'
                            value={this.state.password}
                            onChange={this.inputChangeHandler}
                            className='auth-form__input'
                        />
                        <button className='btn auth-login'>Войти</button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    error: state.users.loginError
});

const mapDispatchToProps = dispatch => ({
    loginUser: userData => dispatch(loginUser(userData))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

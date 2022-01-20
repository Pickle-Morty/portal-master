import React, {Fragment} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import './UserMenu.css';
import TestingCatalog from "../../../containers/Testing/TestingCatalog";

const UserMenu = ({user, logout}) => (
    <Fragment>
        <header className='header'>
            <div className='container'>
                <div className='header-wrap'>
                    <h4 className='header-title'>Информационный портал кафедры ИСТТ</h4>
                    <Button className='logout' onClick={logout}>Выйти</Button>
                </div>
            </div>
        </header>
        <nav className='nav'>
            <div className='container'>
                <div className='nav-wrap'>
                    <ul className='header-menu'>
                        <li className='header-menu__item'>
                            <Link component={RouterLink} to='/main' className='header-menu__link'>Доска объявлений</Link>
                        </li>
                        <li className='header-menu__item'>
                            <Link component={RouterLink} to='/catalog' className='header-menu__link'>Каталог учебного материала</Link>
                        </li>
                        <li className='header-menu__item'>
                            <Link component={RouterLink} to='/testing-catalog' className='header-menu__link'>Тестирование</Link>
                        </li>
                    </ul>
                    <div className='personal-account'>
                        <svg width='30' height='30' viewBox='0 0 30 30' fill='one' xmlns='http://www.w3.org/2000/svg'>
                            <path fillRule='evenodd' clipRule='evenodd' d='M15 28.75C7.40609 28.75 1.25 22.5939 1.25 15C1.25 7.40609 7.40609 1.25 15 1.25C22.5939 1.25 28.75 7.40609 28.75 15C28.75 22.5939 22.5939 28.75 15 28.75ZM24.2494 21.4059C25.5108 19.5879 26.25 17.3803 26.25 15C26.25 8.78679 21.2133 3.74999 15 3.74999C8.78684 3.74999 3.75005 8.78679 3.75005 15C3.75005 17.3802 4.48926 19.5878 5.75063 21.4057C7.15747 19.5476 10.4633 18.75 15 18.75C19.5368 18.75 22.8426 19.5476 24.2494 21.4059ZM22.4558 23.4248C22.09 22.1092 19.4618 21.25 15 21.25C10.5383 21.25 7.91005 22.1092 7.54412 23.4246C9.52911 25.1827 12.1399 26.25 15 26.25C17.8601 26.25 20.4709 25.1827 22.4558 23.4248ZM15 7.49999C11.9738 7.49999 9.99995 9.69469 9.99995 12.5C9.99995 16.7842 12.201 18.75 15 18.75C17.7726 18.75 20 16.8495 20 12.75C20 9.90197 18.0177 7.49999 15 7.49999ZM12.5 12.5C12.5 15.3366 13.5228 16.25 15 16.25C16.4721 16.25 17.5 15.373 17.5 12.75C17.5 11.188 16.5196 10 15 10C13.4172 10 12.5 11.0198 12.5 12.5Z' fill='#2A2A2A'/>
                        </svg>
                        <Link component={RouterLink} to='/personal-account' className='personal-account__link'>Личный кабинет</Link>
                    </div>
                </div>
            </div>
        </nav>
    </Fragment>
);

export default UserMenu;

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {fetchAdminUsers} from '../../store/actions/adminUsersActions';

import './Subjects.css';

class Subjects extends Component {

    componentDidMount() {
        this.props.onFetchUsers();
    }

    render() {
        return (
            <div className='my-subject-list'>
                {
                    this.props.adminUsers.map(user => {
                        return (
                            this.props.user._id === user._id &&
                                user.appointSubjects.map((subject, index) => {
                                    return (
                                        <span key={index} className='my-subject-list__item'>{subject.subject}</span>
                                    )
                                })
                        )
                    })
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.users.user,
    adminUsers: state.adminUsers.adminUsers
});

const mapDispatchToProps = dispatch => ({
    onFetchUsers: () => dispatch(fetchAdminUsers()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Subjects));

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
import Toolbar from '../../components/UI/Toolbar';
import {logoutUser} from '../../store/actions/userActions';
import {addFileToSubject, fetchSubjects} from '../../store/actions/subjectActions';
import {fetchAdminUser, fetchAdminUsers} from '../../store/actions/adminUsersActions';
import './TestingCatalog.css';
import '../Board/Board.css';
import {apiURL} from '../../constants';
import TextField from "@material-ui/core/TextField/TextField";
import AttachFileIcon from "@material-ui/core/SvgIcon/SvgIcon";

class TestingCatalog extends Component {
    state = {
        subject: '',
        testingTitle:'',
        testingSubject:'',
        questionTitle:'',
        questionType:'',
        answer:[],
        testAnswer:{
            question:'',
            flag:''
        },
        answerTitle:'',
        answerFlag:false,
        answerVariants:[],
        answerFlags:[],
        testing:{
            title:'',
            subject:'',
            questions: [],
        },
        testings:[
            {
                title:'тест 1',
                subject:'Информационная безопасность',
                questions: [
                    {
                        title:'Вопрос 1',
                        type:'one',
                        answer:['один','два','три true','четыре'],
                        flag:[false,false,true,false]
                    },{title:'Вопрос 2',
                        type:'one',
                        answer:['ответ 1','ответ 2 true','ответ 3 ','ответ 4'],
                        flag:[false,true,false,false]
                    },{title:'Вопрос 3',
                        type:'one',
                        answer:['one','two','three true','four'],
                        flag:[false,false,true,false]
                    },{title:'Вопрос 4',
                        type:'one',
                        answer:['one','two true','three','four'],
                        flag:[false,true,false,false]
                    },{title:'Вопрос 5',
                        type:'text'
                    }],
            },
            {
                title:'тест 2',
                subject:'Графика',
                questions: [
                {
                    title:'Вопрос 1',
                    type:'one',
                    answer:['один','два','три true','четыре'],
                    flag:[false,false,true,false]
                },{title:'Вопрос 2',
                    type:'one',
                    answer:['ответ 1','ответ 2 true','ответ 3 ','ответ 4'],
                    flag:[false,true,false,false]
                },{title:'Вопрос 3',
                    type:'one',
                    answer:['one','two','three true','four'],
                    flag:[false,false,true,false]
                },{title:'Вопрос 4',
                    type:'more',
                    answer:['one','two true','three true','four'],
                    flag:[false,true,true,false]
                },{title:'Вопрос 5',
                    type:'text'
                }
                ],
            },
            {
                title:'тест 3',
                subject:'Информатика',
                questions: [
                    {
                    title:'Question 1',
                    type:'one',
                    answer:['one','two','three true','four'],
                    flag:[false,false,true,false]
                },{title:'Question 2',
                    type:'one',
                    answer:['one','two true','three ','four'],
                    flag:[false,true,false,false]
                },{title:'Question 3',
                    type:'one',
                    answer:['one','two','three true','four'],
                    flag:[false,false,true,false]
                },{title:'Question 4',
                    type:'more',
                    answer:['one','two true','three true','four'],
                    flag:[false,true,true,false]
                },{title:'Question 5',
                    type:'text'
                }
                ],}
        ],
        variantFlag:false,
        startTestModal: false,
        addQuestion:false,
        addTestModal:false,
        userId: '',
        status:true,
        count:0,
        textTest:[]
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
    openAddTestModal = () => {
        this.setState({addTestModal: true});
    };
    closeAddTestModal = () => {
        this.setState({addTestModal: false, subject: '', testingTitle:'', questions: []});
    };
    getUserDataById = async (event) => {
        event.preventDefault();
        await this.setState({userId: event.target.id});

        await this.props.onFetchUser(this.state.userId);
    };
    submitFormHandler = event => {
        let testings= this.state.testings;
        this.setState({
            testings:[...testings,
                {
                    title:this.state.testing.title,
                    subject:this.state.testing.subject,
                    questions: [...this.state.testing.questions],
                }],
            testing:{
                title:'',
                subject:'',
                questions: [],
            },
        });
        console.log(this.state.testings)
        this.closeAddTestModal()
    };
    addQuestion = () =>{
        this.setState({addQuestion: true});
    };
    submitTestTitle = () =>{
        this.setState({
                testing:{
                    ...this.state.testing,
                    title:this.state.testingTitle,
                    subject:this.state.subject
                }
        }
        );
    };
    editTestTitle = () =>{
        this.setState({
            testingTitle:this.state.testing.title,
            subject:this.state.testing.subject,
            testing:{
                ...this.state.testing,
                title:'',
                subject:''
            }
        }
        );
    };
    submitVariants = () =>{
            let answerVar=this.state.answerVariants;
            let answerFlags=this.state.answerFlags;
            if (this.state.answerFlag) {
                this.setState({
                    answerVariants:[...answerVar, this.state.answerTitle],
                    answerFlags:[...answerFlags,true],
                    answerTitle:'',
                    variantFlag: true,
                    answerFlag:false})
            } else{
                this.setState({
                    answerVariants:[...answerVar, this.state.answerTitle],
                    answerFlags:[...answerFlags,this.state.answerFlag],
                    answerTitle:'',
                });
            }
    };
    submitQuestion = () =>{
let questions=this.state.testing.questions;
        if(this.state.questionType==='text'){
            this.setState({
                testing:{
                    ...this.state.testing,
                    questions:[...questions,{
                        title:this.state.questionTitle,
                        type:this.state.questionType,
                    }]
                }
            });
        }else{
            this.setState({
                testing:{
                    ...this.state.testing,
                    questions:[...questions,{
                        title:this.state.questionTitle,
                        type:this.state.questionType,
                        answer:this.state.answerVariants,
                        flag:this.state.answerFlags,
                    }]
                }
            });
        }
        this.setState({
            addQuestion:false,
            variantFlag:false,
            questionTitle:'',
            questionType:'',
            answerVariants:[],
            answerFlags:[],
        });
    };
    testingStart = (event) =>{
        this.state.testings.map(el=>{
           if(el.title===event.target.id){
               this.setState({
                   testingTitle: el.title,
                   testingSubject:el.subject,
                   testing:{
                       ...this.state.testing,
                       title:el.title,
                       subject:el.subject,
                       questions:[...el.questions],
                   }

               });
           }
        });
        if(this.state.testingTitle!=='' && this.state.testingSubject!==''){
            this.setState({startTestModal: true});
}

    };
    checkAnswer =(event)=>{
            if(event.target.value){
                this.setState({
                count:this.state.count+2
                })
            }

        };
    checkText = event => {

            this.setState({
                questionType:event.target.value,
                textTest:[...this.state.textTest,[event.target.name,event.target.value]]
            })
    };
    submitFormHandl = event => {
        this.setState({status: false});
    };

    endTest =()=>{
        this.setState({startTestModal: false});
    };


    render() {
            let testingItem = null;
            if (this.props.adminUser.appointSubjects) {
                testingItem = this.props.adminUser.appointSubjects.map(subject => {
                    return (
                        <div className='right-column-subject' key={subject._id}>
                            <h5 className='right-column-subject__title'>{subject.subject}</h5>
                            {
                                this.state.testings.map((testing) => {
                                    if(testing.subject===subject.subject){
                                        return (
                                            <ul>
                                                <li>
                                                    <a className='right-column-subject__test'
                                                       id={testing.title}
                                                       onClick={this.testingStart}>
                                                        {testing.title}
                                                    </a>
                                                </li>
                                            </ul>

                                        )
                                    }
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
                            <h4 className='top__title'>Тестирование</h4>
                            <Button className='top__btn common-btn' onClick={this.openAddTestModal}>+ Добавить тест</Button>
                        </div>
                        {this.state.addTestModal?
                            <Dialog onClose={this.closeAddTestModal} open={this.state.addTestModal} className='add-user-modal'>
                            <DialogTitle onClose={this.closeAddTestModal} className='header-modal'>
                                Добавить тестирование
                                <IconButton aria-label='delete' className='close-modal' onClick={this.closeAddTestModal}>
                                    <CloseIcon fontSize='large' />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent>
                                <form className='add-notice-form'>
                                    {this.state.testing.title==='' && this.state.testing.subject===''?/*заголовок теста*/
                                    <div className='test-header'>
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
                                                            <option value={subject.subject} key={subject._id}>{subject.subject}</option>
                                                        )
                                                    })
                                                }

                                            </Select>
                                        </FormControl>
                                        <TextField
                                            label='Название теста'
                                            type='text'
                                            name='testingTitle'
                                            value={this.state.testingTitle}
                                            onChange={this.inputChangeHandler}
                                            className='auth-form__input'
                                        />
                                        <Button autoFocus color='primary' onClick={this.submitTestTitle}>
                                            Сохранить
                                        </Button>
                                    </div>
                                    :   <div className='test-header-upd'>
                                            <div>
                                             <p>Название теста : {this.state.testing.title}</p>
                                             <p>дисциплина : { this.props.subjects.map(subject => {
                                                 if(this.state.testing.subject===subject.subject){
                                                     return (<span>{subject.subject}</span>)
                                                 }
                                             })}</p>
                                            </div>
                                            <div><Button autoFocus color='primary' onClick={this.editTestTitle}>
                                                Редактировать заголовок
                                            </Button></div>
                                        </div>
                                    }
                                    <ol className='questions-list'>{/*предпросмотр*/}
                                        {this.state.testing.questions.map((el)=>{
                                            return <div>
                                                <li><h3> {el.title} </h3></li>
                                                <ol className='variants-list'>
                                                {el.type!=='text'?el.answer.map((element,index)=>{
                                                    if(el.flag[index]===true){
                                                        return <li><p> {element} правильный ответ</p></li>
                                                    }else{
                                                        return <li><p> {element} </p></li>
                                                    }
                                                }):null}
                                                </ol>
                                            </div>

                                        })}
                                    </ol>


                                    {this.state.addQuestion?
                                        <div className='add-new-question'>
                                            <form className='add-question'>
                                                <TextField
                                                    label='Вопрос'
                                                    type='text'
                                                    name='questionTitle'
                                                    value={this.state.questionTitle}
                                                    onChange={this.inputChangeHandler}
                                                    className='auth-form__input'
                                                />
                                                <FormControl variant='outlined'>
                                                <Select
                                                    native
                                                    name='questionType'
                                                    value={this.state.questionType}
                                                    onChange={this.inputChangeHandler}
                                                >
                                                    <option value='' disabled>тип ответа</option>
                                                    <option value='one'>один ответ</option>
                                                    <option value='more'>несколько ответов</option>
                                                    <option value='text'>текстовый ответ</option>
                                                </Select>
                                            </FormControl>
                                                <ol>
                                                {this.state.answerVariants.map((el,index)=>{
                                                  if(this.state.answerFlags[index]===true){
                                                     return <li> {el} (Правильный ответ)</li>
                                                  }else{
                                                     return <li> {el} </li>
                                                  }



                                                })}
                                                </ol>
                                                {this.state.questionType==='one'?<div>
                                                        <label>
                                                            <TextField
                                                                label='вариант ответа'
                                                                type='text'
                                                                name='answerTitle'
                                                                value={this.state.answerTitle}
                                                                onChange={this.inputChangeHandler}
                                                                className='auth-form__input'
                                                            />
                                                                    {this.state.variantFlag===false?
                                                                        <FormControl variant='outlined'>
                                                                            <Select
                                                                                native
                                                                                name='answerFlag'
                                                                                value={this.state.answerFlag}
                                                                                onChange={this.inputChangeHandler}
                                                                            >
                                                                                <option value='' disabled>тип ответа</option>
                                                                                <option value={true} >правильный</option>
                                                                                <option value={false} selected={false}>неправильный</option>
                                                                            </Select>
                                                                        </FormControl>
                                                                        : <FormControl variant='outlined'>
                                                                            <Select
                                                                                native
                                                                                name='answerFlag'
                                                                                value={this.state.answerFlag}
                                                                                onChange={this.inputChangeHandler}
                                                                            >
                                                                                <option value={false} selected={false}>неправильный</option>
                                                                            </Select>
                                                                        </FormControl>
                                                                    }
                                                            <Button autoFocus color='primary' onClick={this.submitVariants}>
                                                               Сохранить ответ
                                                            </Button>
                                                            {this.state.answerFlags.length>3 && this.state.answerVariants.length>3?
                                                                <Button autoFocus color='primary' onClick={this.submitQuestion}>
                                                                    Сохранить вопрос
                                                                </Button>
                                                                :null
                                                            }
                                                        </label>
                                                </div>:null}
                                                {this.state.questionType==='more'?<div>
                                                    <label>
                                                        <TextField
                                                            label='вариант ответа'
                                                            type='text'
                                                            name='answerTitle'
                                                            value={this.state.answerTitle}
                                                            onChange={this.inputChangeHandler}
                                                            className='auth-form__input'
                                                        />
                                                            <FormControl variant='outlined'>
                                                                <Select
                                                                    native
                                                                    name='answerFlag'
                                                                    value={this.state.answerFlag}
                                                                    onChange={this.inputChangeHandler}
                                                                >
                                                                    <option value='' disabled>тип ответа</option>
                                                                    <option value={true} >правильный</option>
                                                                    <option value={false} selected={false}>неправильный</option>
                                                                </Select>
                                                            </FormControl>

                                                        <Button autoFocus color='primary' onClick={this.submitVariants}>
                                                            Сохранить ответ
                                                        </Button>
                                                        {this.state.answerFlags.length>3 && this.state.answerVariants.length>3?
                                                            <Button autoFocus color='primary' onClick={this.submitQuestion}>
                                                                Сохранить вопрос
                                                            </Button>
                                                            :null
                                                        }
                                                    </label>
                                                </div>:null}
                                                {this.state.questionType==='text'?<div>
                                                    <Button autoFocus color='primary' onClick={this.submitQuestion}>
                                                        Сохранить вопрос
                                                    </Button>
                                                </div>:null}
                                            </form>
                                        </div>
                                    :
                                        <Button autoFocus color='primary' onClick={this.addQuestion}>
                                            Добавить вопрос
                                        </Button>
                                    }

                                    <div className='form-button-wrap'>
                                        <Button autoFocus color='primary'  onClick={this.submitFormHandler}>
                                            Сохранить
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog> :
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

                                    {testingItem}

                                </div>
                            </div>
                        }
                        {this.state.startTestModal?
                            <Dialog onClose={this.closeCatalogModal} open={this.state.startTestModal} className='add-user-modal'>
                                <DialogTitle onClose={this.closeCatalogModal} className='header-modal-testing'>
                                    Добро пожаловать на тестирование <br/>
                                    {this.props.user.fullName}
                                </DialogTitle>
                                <DialogContent>
                                    <form className='add-notice-form' onSubmit={this.submitFormHandl}>
                                        <div className='testing-list'>
                                            <h3 className='testing-title'>Название теста : {this.state.testingTitle}</h3>
                                            <h3 className='testing-subject'>Дисциплина : {this.state.testingSubject}</h3>
                                        </div>
                                        {this.state.status?
                                            this.state.testings.map(el=>{
                                            if(el.title===this.state.testingTitle && this.state.testingSubject===el.subject){
                                               return <div className='testing-list'>
                                                    <ol className='question-list'>
                                                        {el.questions.map((questionItem) =>{
                                                            if(questionItem.type==='one'){
                                                                return  <li className='question-item'>
                                                                    <p className='question-title'>{questionItem.title}</p>
                                                                    <ol>
                                                                        {questionItem.answer.map((ansT,index)=>{
                                                                          return <li className='answer-item'>
                                                                              <label className='cont'>
                                                                                  <input
                                                                                      type='radio'
                                                                                      name={questionItem.title}
                                                                                      value={questionItem.flag[index]}
                                                                                      onChange={this.checkAnswer}
                                                                                  /><span className='checkmark'></span>
                                                                                  {ansT}
                                                                              </label>
                                                                          </li>
                                                                        })}
                                                                    </ol>
                                                                </li>
                                                            }else if(questionItem.type==='more'){
                                                                return  <li className='question-item'>
                                                                    <p className='question-title'>{questionItem.title}</p>
                                                                    <ol>
                                                                        {questionItem.answer.map((ansT,index)=>{
                                                                            return <li className='answer-item'>
                                                                                <label>
                                                                                    <input
                                                                                        type='checkbox'
                                                                                        name={questionItem.title}
                                                                                        value={questionItem.flag[index]}
                                                                                        onChange={this.checkMoreAnswer}
                                                                                    />
                                                                                    {ansT}
                                                                                </label>
                                                                            </li>
                                                                        })}
                                                                    </ol>
                                                                </li>
                                                            }else{
                                                                return  <li className='question-item'>
                                                                    <p className='question-title'>{questionItem.title}</p>
                                                                    <textarea className='text_box' key={questionItem.title} onChange={this.checkText}/>
                                                                </li>
                                                            }
                                                        })}
                                                    </ol>
                                                   <div className='form-button-wrap'>
                                                   <Button autoFocus color='primary' onClick={this.submitFormHandl}>
                                                       Завершить
                                                   </Button>
                                               </div>
                                                </div>
                                            }
                                        }):<div>
                                                <h1 className='score'> {this.state.count} </h1><br/>
                                                <Button autoFocus color='primary' onClick={this.endTest}>
                                                Выйти
                                            </Button>
                                            </div>
                                        }
                                    </form>
                                </DialogContent>
                            </Dialog>
                            :null
                        }
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

export default  withRouter(connect(mapStateToProps, mapDispatchToProps)(TestingCatalog));

// SurveyForm shows a form for user to add input
import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { reduxForm, Field } from 'redux-form';
import SurveyField from './SurveyField';

import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

class SurveyForm extends Component {

  renderFields() {
    return _.map(formFields, ({ name, label }) => {
      return <Field key={ name } component={ SurveyField } type="text" name={ name } label={ label } />;
    });
  }

  // handleSubmit 是 redux-form 提供的方法
  // onSurveySubmit 是 SurveyNew 传进的属性
  render() {
    return (
      <div>
        <form
          onSubmit={ this.props.handleSubmit(this.props.onSurveySubmit) }
        >
          { this.renderFields() }
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button className="teal btn-flat right white-text" type="submit">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

// 如果 redux-form 接收的是一个空对象，它就会认为没有错误以及表单可以提交了
function validate(values) {
  const errors = {};

  // 这个 || '' 必须写，因为一开始刷新页面后你没有输入东西，所以 values = undefined，就会报错
  errors.recipients = validateEmails(values.recipients || '');

  _.each(formFields, ({ name }) => {
    if(!values[name]) {
      errors[name] = `You must provide a ${name}`;
    }
  });

  return errors;
}

export default reduxForm({
  validate: validate,
  form: 'surveyForm',
  destroyOnUnmount: false // do not destroy the form so that when we go back, the form value keeps alive
})(SurveyForm);
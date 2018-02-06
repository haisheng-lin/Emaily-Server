// SurveyFormReview shows users their form inputs for review
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import formFields from './formFields';
import * as actions from '../../actions';

// 这个 history 对象是 withRouter 给的
const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {

  const reviewFields = _.map(formFields, ({ name, label }) => {
    return (
      <div key={ name }>
        <label>{ label }</label>
        <div>{ formValues[name] }</div>
      </div>
    );
  });

  // onCancel 是 SurveyNew 传进的属性
  // if onClick = { submitSurvey(formValues) }，this function will be executed
  // instantly once the component is rendered
  return (
    <div>
      <h5>Please confirm your input.</h5>
      { reviewFields }
      <button
        className="yellow darken-3 btn-flat white-text"
        onClick={ onCancel }
      >
        Back
      </button>
      <button
        className="green btn-flat right white-text"
        onClick={ () => submitSurvey(formValues, history) }
      >
        Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>
  )
};

function mapStateToProps({ form }) {
  return { formValues: form.surveyForm.values };
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));
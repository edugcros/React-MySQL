import React, { useState,useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

/* utils */
import { absoluteUrl, getAppCookies } from '../../middleware/utils';

/* components */
import Layout from '../../components/layout/Layout';
import FormEvent from '../../components/form/FormEvent';

/* post schemas */
const FORM_DATA_EVENT = {
  title: {
    value: '',
    label: 'Title',
    min: 10,
    max: 36,
    required: true,
    validator: {
      regEx: /^[a-z\sA-Z0-9\W\w]+$/,
      error: 'Please insert valid Title',
    },
  },
  desc: {
    value: '',
    label: 'Description',
    min: 6,
    max: 1500,
    required: true,
    validator: {
      regEx: /^[a-z\sA-Z0-9\W\w]+$/,
      error: 'Please insert valid Content',
    },
  },
  start: {
    value: '',
    label: 'date',
    min: 6,
    max: 1500,
    required: true,
    validator: {
      regEx: /^[a-z\sA-Z0-9\W\w]+$/,
      error: 'Please insert valid Report Manager',
    },
  },
  end: {
    value: '',
    label: 'Date',
    min: 6,
    max: 24,
    required: true,
    validator: {
      regEx: /^[a-z\sA-Z0-9\W\w]+$/,
      error: 'Please insert valid Date limit',
    },
  },
};

function Event(props) {
  const router = useRouter();

  const { origin, event, token } = props;

  const { baseApiUrl } = props;
  const [loading, setLoading] = useState(false);

  const [stateFormData, setStateFormData] = useState(FORM_DATA_EVENT);
  const [stateFormError, setStateFormError] = useState([]);
  const [stateFormMessage, setStateFormMessage] = useState({});
  const [stateFormValid, setStateFormValid] = useState(false);

  async function onSubmitHandler(e) {
    e.preventDefault();

    let data = { ...stateFormData };

    /* title */
    data = { ...data, title: data.title.value || '' };
    /* description */
    data = { ...data, desc: data.desc.value || '' };
    /* start */
    data = { ...data, start: data.start.value || '' };
    /* end */
    data = { ...data, end: data.end.value || '' };

    /* validation handler */
    let isValid = validationHandler(stateFormData);

    if (e.target.end.value < e.target.start.value) {
      isValid = false;

      alert ("the event start date must be less than the end date");
    }
    if (isValid) {
      // Call an external API endpoint to get posts.
      // You can use any data fetching library

      setLoading(!loading);
      const eventApi = await fetch(`${baseApiUrl}/event/[slug]`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: token || '',
        },
        body: JSON.stringify(data),
      });

      let result = await eventApi.json();
      if (
        result.status === 'success' &&
        result.message &&
        result.message === 'done' &&
        result.data
      ) {
        router.push({
          pathname: result.data.slug ? `/event/${result.data.slug}` : '/event',
        });
      }else{
        setStateFormMessage(result);
      }
      setLoading(false);
    }
  }

  function onChangeHandler(e) {
    const { name, value } = e.currentTarget;

    setStateFormData({
      ...stateFormData,
      [name]: {
        ...stateFormData[name],
        value,
      },
    });

    /* validation handler */
    validationHandler(stateFormData, e);
  }

  function validationHandler(states, e) {
    const input = (e && e.target.name) || '';
    const errors = [];
    let isValid = true;

    if (input) {
      if (states[input].required) {
        if (!states[input].value) {
          errors[input] = {
            hint: `${states[e.target.name].label} required`,
            isInvalid: true,
          };
          isValid = false;
        }
      }
      if (
        states[input].value &&
        states[input].min > states[input].value.length
      ) {
        errors[input] = {
          hint: `Field ${states[input].label} min ${states[input].min}`,
          isInvalid: true,
        };
        isValid = false;
      }
      if (
        states[input].value &&
        states[input].max < states[input].value.length
      ) {
        errors[input] = {
          hint: `Field ${states[input].label} max ${states[input].max}`,
          isInvalid: true,
        };
        isValid = false;
      }
      if (
        states[input].validator !== null &&
        typeof states[input].validator === 'object'
      ) {
        if (
          states[input].value &&
          !states[input].validator.regEx.test(states[input].value)
        ) {
          errors[input] = {
            hint: states[input].validator.error,
            isInvalid: true,
          };
          isValid = false;
        }
      }
    } else {
      Object.entries(states).forEach(item => {
        item.forEach(field => {
          errors[item[0]] = '';
          if (field.required) {
            if (!field.value) {
              errors[item[0]] = {
                hint: `${field.label} required`,
                isInvalid: true,
              };
              isValid = false;
            }
          }
          if (field.value && field.min >= field.value.length) {
            errors[item[0]] = {
              hint: `Field ${field.label} min ${field.min}`,
              isInvalid: true,
            };
            isValid = false;
          }
          if (field.value && field.max <= field.value.length) {
            errors[item[0]] = {
              hint: `Field ${field.label} max ${field.max}`,
              isInvalid: true,
            };
            isValid = false;
          }
          if (field.validator !== null && typeof field.validator === 'object') {
            if (field.value && !field.validator.regEx.test(field.value)) {
              errors[item[0]] = {
                hint: field.validator.error,
                isInvalid: true,
              };
              isValid = false;
            }
          }
        });
      });
    }
    if (isValid) {
      setStateFormValid(isValid);
    }
    setStateFormError({
      ...errors,
    });
    return isValid;
  }

  function renderEventForm() {
    return (
      <>
        <Link
          href={{
            pathname: '/event',
          }}
        >
          <a>&larr; Back</a>
        </Link>
        <FormEvent
          onSubmit= {onSubmitHandler}
          onChange= {onChangeHandler}
          loading={loading}
          stateFormData={stateFormData}
          stateFormError={stateFormError}
          stateFormValid={stateFormValid}
          stateFormMessage={stateFormMessage}
        />
      </>
    );
  }

  function renderEventList() {
    return (
      <div className="card">
        <Link
          href={{
            pathname: '/event',
          }}
        >
          <a>&larr; Back</a>
        </Link>
        <h2
          className="sub-title"
          style={{
            display: 'block',
            marginTop: '.75rem',
          }}
        >
          {event.data.title}
          <small
            style={{
              display: 'block',
              fontWeight: 'normal',
              marginTop: '.75rem',
            }}
          >
            Posted: {event.data.createdAt}
          </small>
        </h2>
        <p>{event.data.desc}</p>
        <p>Start: {event.data.start}</p>
        <p>End :{event.data.end}</p>
        <hr />
        By: {event.data.user.username || ''} {event.data.user.lastName || ''}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
        <button onClick={() => eventdelete(event.data.slug)}
          style={{
          fontWeight: 'normal',
          background:'red',
          width: '25%',
          color: 'white',
          display: 'inline-block',
        }}>Delete
        </button>
        <button onClick={() => updateEvent(event.data)}
          style={{
            fontWeight: 'normal',
            width: '25%',
            marginLeft:'4%',
            background: 'green',
            color: 'white',
            display: 'inline-block',
        }}>Edit
        </button>
        </div>
      </div>
    );
  }

  const eventdelete = async (slug) => { 
    const baseApiUrl = `${origin}/api`;
    
    var answer = confirm("DO YOU WANT TO REMOVE THE LABEL?")
    try {
        if(answer){
          await fetch(`${baseApiUrl}/event/${slug}`,{
            method:'DELETE',
          })
          return router.push('/event');
        }
        else{
          return router.push('/event');
        }
    }
    catch (error) {
      console.log(error)
    }
  }


  async function updateEvent(data){
    router.push({
      pathname: `/event/edit/${data.slug}` 
    });
  }

  return (
    <Layout
      title={`Next.js with Sequelize | event Page - ${event.data &&
        event.data.title}`}
      url={`${origin}${router.asPath}`}
      origin={origin}
    >
      <div className="container">
        <main className="content-detail">
          {router.asPath === '/event/add' ? renderEventForm() : renderEventList()}
        </main>
      </div>
    </Layout>
  );
  
}


/* getServerSideProps */
export async function getServerSideProps(context) {
  const { query, req } = context;
  const { origin } = absoluteUrl(req);

  const token = getAppCookies(req).token || '';
  const baseApiUrl = `${origin}/api`;

  let event = {};

  if (query.slug !== 'add') {
    const eventApi = await fetch(`${baseApiUrl}/event/${query.slug}`);
    event = await eventApi.json();
  }

  return {
    props: {
      origin,
      baseApiUrl,
      event,
      token,
    },
  };
}

export default Event;

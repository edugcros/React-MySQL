import React, { useState } from 'react';
import Link from 'next/link';
import router, { useRouter } from 'next/router';
import { render } from 'nprogress';


/* utils */
import { absoluteUrl, getAppCookies } from '../../../middleware/utils';

/* components */
import Layout from '../../../components/layout/Layout';
import FormEvent from '../../../components/form/FormEvent';


function Edit(props){
    const router = useRouter();
   
    const { origin, event, token } = props;
    const { baseApiUrl } = props;  

    const FORM_DATA_EVENT = {
        title: {
          value: event.data.title,
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
          value: event.data.desc,
          label: 'Description',
          min: 6,
          max: 1500,
          required: true,
          validator: {
            regEx: /^[a-z\sA-Z0-9\W\w]+$/,
            error: 'Please insert valid description',
          },
        },
        start: {
          value: event.data.start,
          label: 'Content',
          min: 6,
          max: 1500,
          required: true,
          validator: {
            regEx: /^[a-z\sA-Z0-9\W\w]+$/,
            error: 'Please insert valid Report Manager',
          },
        },
        end: {
          value: event.data.end,
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

    const [stateFormData, setStateFormData] = useState(FORM_DATA_EVENT);
    const [loading, setLoading] = useState(false);
    const [stateFormError, setStateFormError] = useState([]);
    const [stateFormMessage, setStateFormMessage] = useState({});
    const [stateFormValid, setStateFormValid] = useState(false);
    
    
    async function onSubmitHandler(e) {
      e.preventDefault();
      
      let data = { ...stateFormData };
      

      /* validation handler */
      onChangeHandler(e);
      const isValid = validationHandler(stateFormData);
  
      if (isValid) {
        // Call an external API endpoint to get posts.
        // You can use any data fetching library
        setLoading(!loading);
        const postApi = await fetch(`${baseApiUrl}/event/${event.data.slug}`, {
          
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: token || '',
          },
          body: JSON.stringify({
            ...data,
            title: e.target.title.value,
            desc: e.target.desc.value,
            start: e.target.start.value,
            end: e.target.end.value,
          }),
        });
        let result = await postApi.json();
        if (result.message && result.data && result.message === 'done') {
          router.push({
            pathname: result.data.slug ? `/event/${result.data.slug}` : '/event',
          });
        } else {
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
                pathname: `/event/${event.data.slug}`,
              }}
            >
              <a>&larr; Back</a>
            </Link>
            <FormEvent
              onSubmit={onSubmitHandler}
              onChange={onChangeHandler}
              loading={loading}
              stateFormData={stateFormData}
              stateFormError={stateFormError}
              stateFormValid={stateFormValid}
              stateFormMessage={stateFormMessage}
            />
          </>
        );
      }
  
    return (
      <Layout
        title= {`Next.js with Sequelize | event Page - ${event.data &&
          event.data.title}`}
        url={`${origin}${router.asPath}`}
        origin={origin}
      >
        <div className="container">
          <main className="content-detail">
            {router.asPath === `/event/edit/${event.data.slug}` ? renderEventForm() : '/event'}
          </main>
        </div>
      </Layout>
    );
}

export async function getServerSideProps(context) {
  const { query, req } = context;
  const { origin } = absoluteUrl(req);


  const token = getAppCookies(req).token || '';
  const baseApiUrl = `${origin}/api`;

  let event = {};
  console.log(query.slug)
  if (query.slug !== 'add') {
    const postApi = await fetch(`${baseApiUrl}/event/${query.slug}`);
    event = await postApi.json();
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
export default Edit;
import React, { useState } from 'react';
import Link from 'next/link';
import router, { useRouter } from 'next/router';

/* utils */
import { absoluteUrl, getAppCookies } from '../../middleware/utils';

/* components */
import Layout from '../../components/layout/Layout';

/* transaction schemas */
const FORM_DATA_POST = {
  type: {
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
  token: {
    value: '',
    label: 'Content',
    min: 6,
    max: 1500,
    required: true,
    validator: {
      regEx: /^[a-z\sA-Z0-9\W\w]+$/,
      error: 'Please insert valid Content',
    },
  },
};

function Transaction(props) {
  const router = useRouter();
  
  const { origin, token } = props;
  const { baseApiUrl } = props;
  console.log(props)
  
  const [loading, setLoading] = useState(false);
  const [stateFormData, setStateFormData] = useState(FORM_DATA_POST);
  const [stateFormError, setStateFormError] = useState([]);
  const [stateFormMessage, setStateFormMessage] = useState({});
  const [stateFormValid, setStateFormValid] = useState(false);

  async function onSubmitHandler(e) {
    e.preventDefault();
   
    let data = { ...stateFormData };
    /* email */
    data = { ...data, title: data.title.value || '' };
    /* content */
    data = { ...data, content: data.content.value || '' };

    /* validation handler */
    const isValid = validationHandler(stateFormData);

    if (isValid) {
      // Call an external API endpoint to get posts.
      // You can use any data fetching library
      setLoading(!loading);
      const postApi = await fetch(`${baseApiUrl}/transaction/[id]`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: token || '',
        },
        body: JSON.stringify(data),
      });
      console.log(data)
      
      let result = await postApi.json();
      if (result.message && result.data && result.message === 'done') {
        router.push({
          pathname: result.data.id ? `/transaction/${result.data.id}` : '/transaction',
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

  function renderTransaction() {
    return (
      <>
        <Link
          href={{
            pathname: '/transaction',
          }}
        >
          <a>&larr; Back</a>
        </Link>
        {window.confirm("add money") && addMoney()} 
      </>
    );
  }

  function addMoney(){

  }

  function renderTransactionList() {
    return transaction.data ? (
      <div className="card">
        <Link
          href={{
            pathname: '/transaction',
          }}
        >
          <a>&larr; Back</a>
        </Link>

      </div>
    ) : (
      <div className="container">
        <div class="card">Data Not Found</div>
      </div>
    );
  }

  return (
    <Layout
      title={`Next.js with Sequelize | Post Page -`}
      url={`${origin}${router.asPath}`}
      origin={origin}
    >
      <div className="container">
        <main className="content-detail">
          {router.asPath === '/transaction/add' ? renderTransaction() : renderTransactionList()}
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

  let transaction = {};

  if (query.id !== 'add') {
    const transactionApi = await fetch(`${baseApiUrl}/event/${query.id}`);
    transaction = await transactionApi.json();
  }
 
  return {
    props: {
      origin,
      baseApiUrl,
      transaction,
      token,
    },
  };
}

export default Transaction;

import React, { useEffect } from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';

/* utils */
import { absoluteUrl, getAppCookies } from '../middleware/utils';

/* components */
import Layout from '../components/layout/Layout';
import UserNav from '../components/navigation/User';

function Transaction(props) {
  const router = useRouter();
  const { origin, user, transactions, token } = props;

  if (user === undefined){
    router.push({
      pathname: '/user/login'
    });
  }


  //function getBalance(){
  //  let flag = false
  //  let i = 0
  //  if(transactions.data[i] != undefined){
  //    while(!flag){
  //      if(user.id == transactions.data[i].user.id){
  //        return transactions.data[i].user.balance; 
  //      }
  //      else{
  //        i++;
  //      }
  //      return 0;
  //    }
  //  }
  //}

  //const balance = getBalance();
  console.log(transactions)
  
  function renderTransactions() {
    return transactions.data.map((transaction, j) => {
      if (user.id === transaction.user.id){
        return (
          <Link key={j} href="/transaction/[id]" as={`/transaction/${transaction.id}`}>
            <a className="card">
              <div>
                <small>Created: {transaction.createdAt}</small>
                <small style={{ float: 'right' }}>
                </small>
              </div>
              <hr />
              <small style={{ display: 'block' }}>
                {transaction.type === 'add' ? '+50' : '-15'}
              </small>
            </a>
          </Link>
        );
      }  
    });
  } 

  async function loadMoreClick(e) {
    await Router.push({
      pathname: '/transaction',
      query: {
        nextPage: transactions.nextPage ? transactions.nextPage : 5,
      },  
    });
  }

	async function addMoney(){
    if (user === undefined){
      router.push({
        pathname: '/user/login',
      });
    }
    console.log('addMoney')
    const postApi = await fetch(`http://localhost:3000/api/user/${user.id}`, {
    	method: 'PUT',
    	headers: {
    		Accept: 'application/json',
    		'Content-Type': 'application/json',
    		authorization: token || '',
    	},
    	body: JSON.stringify({
    		balanceUpdate: 50,
        status: 'pending',
    	}),
    });
    let result = await postApi.json();

    
    router.push({
      pathname: '/form_payment',
    });
    
    
  }  

  return (
    <Layout
      title="Next.js with Sequelize | Job Page"
      url={`${origin}${router.asPath}`}
      origin={origin}
    >
      <div className="container">
        <main>
          <h1 className="title">
            Sequelize &amp; <a href="https://nextjs.org">Next.js!</a>
          </h1>
          <p className="description">
            <img
              src="/sequelize.svg"
              alt="Sequelize"
              height="120"
              style={{ marginRight: '1rem' }}
            />
            <img src="/nextjs.svg" alt="Next.js" width="160" />
          </p>
          <UserNav props={{ user: user }} />
          <h2>
            <Link
              href={{
                pathname: '/',
              }}
            >
              <a>&larr; </a>
            </Link>
            Latest Transactions
          </h2>
          <button 
              onClick={() => addMoney()}
              style={{
                width: "20%",
                background: 'green',
                border: 'none',
                color: 'white',
                padding: '10px', 
                display: 'inline-block',
                borderRadius: '5px'
              }}
            >
						Add Money
					</button>
         
          <div className="grid">
            <small
              style={{
                textAlign: 'center',
                marginTop: '0rem',
                marginBottom: '1rem',
              }}
            >
          </small>
            {transactions.status === 'success' ? (
              transactions.data.length && renderTransactions()
            ) : (
              <h3
                style={{
                  textAlign: 'center',
                  marginTop: '0rem',
                  marginBottom: '1rem',
                  display: 'inline-block',
                  width: '100%',
                }}
              >
                {transactions.error}
              </h3>
            )}

            {transactions.status === 'success' && (
              <>
                {transactions.nextPage < transactions.total &&
                transactions.data.length !== transactions.total ? (
                  <button onClick={loadMoreClick}>Next</button>
                ) : (
                  <span className="span-info">no page left</span>
                )}
                <style jsx>
                  {`
                    button,
                    .span-info {
                      margin: 1rem auto;
                      padding: 0.5rem 1rem;
                      border: 1px solid #cecece;
                      background-color: #fffcfc;
                      color: #7b7b7b;
                      outline: none;
                    }
                  `}
                </style>
              </>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
}

/* getServerSideProps */
export async function getServerSideProps(context) {
  const { query, req } = context;
  const { nextPage } = query;
  const { origin } = absoluteUrl(req);

  const token = getAppCookies(req).token || '';
  const referer = req.headers.referer || '';

  const nextPageUrl = !isNaN(nextPage) ? `?nextPage=${nextPage}` : '';
  const baseApiUrl = `${origin}/api`;


  const transactionsApi = await fetch(`${baseApiUrl}/transaction${nextPageUrl}`, {
    headers: {
      authorization: token || '',
    },
  });
  const transactions = await transactionsApi.json();

  return {
    props: {
      origin,
      referer,
      token,
      transactions,
    },
  };
}

export default Transaction;
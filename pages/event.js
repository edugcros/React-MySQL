import React, { useEffect } from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';

/* utils */
import { absoluteUrl, getAppCookies } from '../middleware/utils';

/* components */
import Layout from '../components/layout/Layout';
import UserNav from '../components/navigation/User';

function Event(props) {
  const router = useRouter();
  const { origin, user, events } = props;

  function renderEvents() {
    return events.data.map((event, j) => {
      return (
        <Link key={j} href="/event/[slug]" as={`/event/${event.slug}`}>
          <a className="card">
            <h3 className="headline">{event.title}</h3>
            <div>
              <small>Posted: {event.createdAt}</small>
              <small style={{ float: 'right' }}>
                event by: {event.user.firstName || ''} {event.user.lastName || ''}
              </small>
            </div>
            {/* <p className="description">{event.content}</p> */}

          </a>
        </Link>
      );
    });
  }

  async function loadMoreClick(e) {
    await Router.push({
      pathname: '/event',
      query: {
        nextPage: events.nextPage ? events.nextPage : 5,
      },
    });
  }

  return (
    <Layout
      title="Next.js with Sequelize | event Page"
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
            Latest events
          </h2>
          <div className="grid">
            <small
              style={{
                textAlign: 'center',
                marginTop: '0rem',
                marginBottom: '1rem',
              }}
            >
              <Link href="/event/add">
                <a>+ Add event</a>
              </Link>
            </small>
            {events.status === 'success' ? (
              events.data.length && renderEvents()
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
                {events.error}
              </h3>
            )}

            {events.status === 'success' && (
              <>
                {events.nextPage < events.total &&
                events.data.length !== events.total ? (
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

  const eventsApi = await fetch(`${baseApiUrl}/event${nextPageUrl}`, {
    headers: {
      authorization: token || '',
    },
  });

  const events = await eventsApi.json();

  return {
    props: {
      origin,
      referer,
      token,
      events,
    },
  };
}

export default Event;

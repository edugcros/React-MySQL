import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';


/* utils */
import { absoluteUrl, getAppCookies } from '../middleware/utils';

/* components */

import Layout from '../components/layout/Layout';


const localizer = momentLocalizer(moment);

function Calendary(props) {
  const router = useRouter();

  const { origin, events, user } = props;

  const allEventsList = events.data.map((event) => {
    return {
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
    };
  });

  let myEventsList = [];

  if (user === undefined){
    router.push({
      pathname: '/user/login'
    });
  }else {
    myEventsList = events.data.map((event) => {
      if(user.id === event.user.id){
        return {
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
        };}
      });
  }
  
  

  const [eventSelected, setEventSelected] = useState(allEventsList);

  const onChangeEvent = (e) => {
    let selected = e.target.value;
    selected === "allEvent" ? setEventSelected(allEventsList) : setEventSelected(myEventsList);  
  }

  return (
    
    <Layout
      title="Next.js with Sequelize | Calendar Page"
      url={`${origin}${router.asPath}`}
      origin={origin}
    >
    <div style = {{
      marginTop: '10px',
      marginBottom: '30px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    }}>
      <select id="eventSelect" 
              onChange={(e) => onChangeEvent(e)}
              style={{
                borderColor: '#fff transparent transparent transparent',
                backgroundColor: 'DodgerBlue',
                border: '6px solid transparent',
                padding: '8px 16px',
              }}>
        <option value="allEvent">All events list</option>
        <option value="myEvent">My events list</option>
      </select>  
    </div>      
    <div>
    <Link 
          href={{
            pathname: '/',
          }}
        >
          <a>&larr; Back</a>
        </Link>
      <Calendar
        localizer={localizer}
        events={eventSelected}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
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

export default Calendary;
import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

// ~~~~~~~~~~~~~~~~~~~~~~

function App() {
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); //default for now, switch after
  const [dateQuery, setDateQuery] = useState('');//for setting date instead

  // Calling the api data with axios
  useEffect(() => {
    if (searchQuery || dateQuery) {
    const apiKey = `72U6GAMkp0CtJ8AT1AfsY8vvPRZZZBUk`
    axios({
      url: 'https://app.ticketmaster.com/discovery/v2/events.json',
      method: "GET",
      dataResponse: "json",
      // Make keywords become dynamic and gather the search from the user's input
      params: {
        apikey: apiKey,
        classificationName: "Music",
        keyword: searchQuery,
        localStartDateTime: `${dateQuery}T00:00:00,${dateQuery}T23:59:59`,
        // startEndDateTime: `${dateQuery} `,
      },
    })
      .then((res) => {
      // Gather performer, dates, ticketprices, title of event, images, and location from the response
      setData(res.data._embedded.events);
      console.log(res.data._embedded.events[0]._embedded.venues[0].name);
      //remove this console log eventually
    })
    .catch((error) => {
      console.error('error getting data', error);
    });
  }
  }, [searchQuery, dateQuery]); // this will refetch data when a search query is made

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    initiateSearch(searchQuery); //added this line to make sure it INITIATES the search!!!
  };

  //add one of the above for the searchQuery also???

  const handleDateInputChange = (e) => {
    const selectedDate = e.target.value;
    setDateQuery(e.target.value);
  };
  //this code allows us to search another date without needing a clear button/state

const handleDateSearch = () => {
  initiateSearch(dateQuery);
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


  const initiateSearch = (selectedDate) => {
    const apiKey = `72U6GAMkp0CtJ8AT1AfsY8vvPRZZZBUk`;
    console.log(selectedDate)
    const params = {
      apikey: apiKey,
      classificationName: 'Music',
      keyword: searchQuery,
      // dateTime: dateQuery,
    };

    if (selectedDate) {
      params.date = selectedDate;
    }

    axios({
      url: 'https://app.ticketmaster.com/discovery/v2/events.json',
      method: 'GET',
      dataResponse: 'json',
      params: params,
    })
      .then((res) => {
        setData(res.data._embedded.events);
        console.log(res.data._embedded.events[0]._embedded.venues[0].name);
      })
      .catch((error) => {
        console.error('Error getting that date information', error);
      });
  };

  return (
    
      <div className='wholePage'>
        {/* Mapping over the data array and checking to see how to get all the info */}
        <div className='section1'>
          <div>
            <div>
              <p>Who do you want to see?</p>
            </div>
            <input
              type='text'
              placeholder='Search for stuff'
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </div>
          <div className='orHighlite'><p>OR</p></div>
          <div>
            <div>
              <p>When?</p>
            </div>
            <input
              type='date'
              placeholder='2023/01/01' //placeholder not working but doenst matter
              value={dateQuery}
              onChange={(e) => setDateQuery(e.target.value)}
            />
            
            {/* <button onClick={handleDateSearch}>Search Date</button> */}
          </div>
        </div>
        {/* fix input / needs to link to date data */}

        {data !== null && (
        <ul>
        {data.slice(0, 5).map((event) => (
          <li key={event.id} className='results'>
            <p className='eventName'>Title: {event.name}</p>
            {event.images.length > 0 && (
              <img src={event.images[0].url} alt={data.name} className='eventImg' />
            )}
            <p className='eventDate'>{event.dates.start.localDate}</p>
            {event.priceRanges && event.priceRanges.length > 0 ? (
              <>
                <p className='minPrice'>Min price: {event.priceRanges[0].min}</p>
                <p className='maxPrice'>Max price: {event.priceRanges[0].max}</p>
              </>
            ) : (
              <p>Price information not available</p>
            )}
            <p className='eventLocation'>Location: {event._embedded.venues[0].name}</p>
          </li>
        ))}
        </ul>
        )}
      </div>
    
  )
}

export default App

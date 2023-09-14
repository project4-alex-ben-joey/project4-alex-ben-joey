import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); //default for now, switch after
  const [dateQuery, setDateQuery] = useState('');//for setting date instead

  // Calling the api data with axios
  useEffect(() => {
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
        date: dateQuery,
      },
    }).then((res) => {
      // Gather performer, dates, ticketprices, title of event, images, and location from the response
      setData(res.data._embedded.events);
      console.log(res.data._embedded.events[0]._embedded.venues[0].name);
      //remove this console log eventually
    })
  }, [searchQuery, dateQuery]); // this will refetch data when a search query is made

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDateInputChange = (e) => {
    const selectedDate = e.target.value;
    setDateQuery(e.target.value);
    initiateSearch(selectedDate);
  };

  const initiateSearch = (selectedDate) => {
    const apiKey = `72U6GAMkp0CtJ8AT1AfsY8vvPRZZZBUk`;
    axios({
      url: 'https://app.ticketmaster.com/discovery/v2/events.json',
      method: 'GET',
      dataResponse: 'json',
      params: {
        apikey: apiKey,
        classificationName: 'Music',
        keyword: searchQuery,
        date: selectedDate,
      },
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
              placeholder='01/01/2023'
              value={dateQuery}
              onChange={handleDateInputChange}
            />
          </div>
        </div>
        {/* fix input / needs to link to date data */}

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
      </div>
    
  )
}

export default App

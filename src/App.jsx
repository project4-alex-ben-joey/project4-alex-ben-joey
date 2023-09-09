import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [data, setData] = useState([]);

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
        keyword: "Duran Duran",
      },
    }).then((res) => {
      // Gather performer, dates, ticketprices, title of event, images, and location from the response
      setData(res.data._embedded.events)
      console.log(res.data._embedded.events[0]._embedded.venues[0].name);
    })
  }, [])

  return (
    <>
      <div>
        {/* Mapping over the data array and checking to see how to get all the info */}
        <ul>
        {data.map((event) => (
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
    </>
  )
}

export default App

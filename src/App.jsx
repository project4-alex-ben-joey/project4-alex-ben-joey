import { useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {

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
        keyword: "beyonce",
      },
    }).then((res) => {
      // Gather performer, dates, ticketprices, title of event, images, and location from the response
      console.log(res.data);
    })
  }, [])

  return (
    <>

    </>
  )
}

export default App

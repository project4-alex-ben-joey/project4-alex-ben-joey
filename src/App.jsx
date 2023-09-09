import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import { getDatabase, ref, onValue, push } from 'firebase/database';
import app from './components/Firebase';

function App() {
  const [data, setData] = useState([]);
  const [listName, setListName] = useState('');
  const [budget, setBudget] = useState('');

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
        keyword: "duran duran",
      },
    }).then((res) => {
      // Gather performer, dates, ticketprices, title of event, images, and location from the response
      setData(res.data._embedded.events)
      console.log(res.data._embedded.events[0]._embedded.venues[0].name);
    })

    const database = getDatabase(app);

    const dbRef = ref(database);

    onValue(dbRef, (res) => {
      console.log(res.val());
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();

    const listNameAndBudget = {
      name: listName,
      budget: budget,
    }

    console.log(listNameAndBudget);
    // Send form name and budget to firebase
    const database = getDatabase(app);
    const dbRef = ref(database);


    try {
      push(dbRef, listNameAndBudget);
      console.log('Successful push of:', listNameAndBudget);
      setListName('');
      setBudget('');
    } catch (error) {
      console.error('Error pushing data to Firebase:', error);
    }

    // Add concerts to firebase list
  }
  
  const handleOnAdd = (id) => {
    console.log(`added concert ${id}`);
  }

  return (
    <>
      <div>
        {/* Mapping over the data array and checking to see how to get all the info */}
        {/* Will likely change the structure to an unordered list */}

        {/* Form element for inputting name and budget for concert list */}
        <form onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="name"></label>
          <input
            id='name' 
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder='Name of list'
            required 
          />
          <label htmlFor="budget"></label>
          <input
            id='budget' 
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder='Your budget' 
            required
          />
          <button type='submit'>Submit</button>
        </form>
        {data.map((event) => (
          <>
            <p key={event.id}>Title: {event.name}</p>
            {event.images.length > 0 && (
              <img src={event.images[0].url} alt={data.name} />
            )}
            <p>{event.dates.start.localDate}</p>
            {event.priceRanges && event.priceRanges.length > 0 ? (
              <>
                <p>Min price: {event.priceRanges[0].min}</p>
                <p>Max price: {event.priceRanges[0].max}</p>
              </>
            ) : (
              <p>Price information not available</p>
            )}
            <p>Location: {event._embedded.venues[0].name}</p>
            {/* add button to each concert to send data to firebase list */}
            <button onClick={() => handleOnAdd(event.id)}>Add to list</button>
            {/* change state to show that concert was added and add error handling in case user tries to add concert again */}
          </>
        ))}
      </div>
    </>
  )
}

export default App

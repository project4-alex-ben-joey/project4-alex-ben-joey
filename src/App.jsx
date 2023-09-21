import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import { getDatabase, ref, onValue, push, set, remove } from 'firebase/database';
import app from './components/Firebase';
import { Routes, Link, Route } from 'react-router-dom';
import PublishedLists from './components/PublishedLists';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGuitar } from '@fortawesome/free-solid-svg-icons';


// ~~~~~~~~~~~~~~~~~~~~~~

function App() {
  const [listName, setListName] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedConcerts, setSelectedConcerts] = useState({});
  const [listId, setListId] = useState('');
  const [lists, setLists] = useState([]);
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
    }).then((res) => {
      // Gather performer, dates, ticketprices, title of event, images, and location from the response
      setData(res.data._embedded.events);
      console.log(res.data._embedded.events[0]._embedded.venues[0].name);
      //remove this console log eventually
    })
    .catch((error) => {
      console.error('error getting data', error);
    });
  }}, [searchQuery, dateQuery]) // this will refetch data when a search query is made

  useEffect(() => {
    const database = getDatabase(app);

    const listsRef = ref(database, 'lists');

    onValue(listsRef, (snapshot) => {
      const listsData = snapshot.val();
      if (listsData) {
        const listsArray = Object.keys(listsData).map((key) => ({
          id: key,
          ...listsData[key],
        }))
        setLists(listsArray);
      }
    })
  }, [])

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

  // handle the form submission for the list name and budget along with any concerts being added
  // TO DO: need to handle error if user tries to enter a list with the same name!
  const handleSubmit = (e) => {
    e.preventDefault();

    const listNameAndBudget = {
      name: listName,
      budget: budget,
    };

    console.log(listNameAndBudget);

    // Send form name and budget to Firebase and get the generated list ID
    const database = getDatabase(app);
    const listRef = ref(database, 'lists');

    // make a new list reference and push the list name and budget
    try {
      const newListRef = push(listRef, listNameAndBudget);
      const listId = newListRef.key; // Get the generated list ID
      setListId(listId)
      console.log('Successful push of:', listNameAndBudget);
      setListName('');
      setBudget('');

      // set the new concerts ref for any concerts added.
      const concertsRef = ref(database, `lists/${listId}/concerts`);
      set(concertsRef, {});

      // Call the function to add selected concerts to Firebase
      addConcertsToFirebase(listId);
    } catch (error) {
      console.error('Error pushing data to Firebase:', error);
    }
  };

  // add selected concert to firebase
  const addConcertsToFirebase = (listId, events) => {
      // Check if the event already exists in the selected concerts
    if (selectedConcerts[events.id]) {
      console.log(`Concert ${events.name} is already in list`)
    }

    // Add selected concerts to Firebase under the same listId
    const database = getDatabase(app);
    const concertsRef = ref(database, `lists/${listId}/concerts`);


    try {
      push(concertsRef, events);
      console.log('Success', events);
    } catch (err) {
      console.error('Error', err);
    }
    // Clear the selectedConcerts state after adding to Firebase
    // setSelectedConcerts([]);
  }
  
  
  // function to handle adding concerts to a specific list
  // TO DO: handle error so user can't submit the same concert twice
  const handleOnAdd = (event) => {
    if (!selectedConcerts[event.id]) {
      setSelectedConcerts((prevSelectedConcerts) => ({
        ...prevSelectedConcerts,
        [event.id]: event,
      }));

      addConcertsToFirebase(listId, event);
    } else {
      console.log(`Concert ${event.name} is already in list`)
    }
  };

  // Add this useEffect to populate selectedConcerts when the listId changes
  useEffect(() => {
    if (listId) {
      const database = getDatabase(app);
      const concertsRef = ref(database, `lists/${listId}/concerts`);

      onValue(concertsRef, (snapshot) => {
        const concertsData = snapshot.val();

        if (concertsData) {
          // Transform the concertsData object into an array of concert objects
          const concertObjects = Object.values(concertsData);

          // Create an object where each concert's ID is its key
          const selectedConcertsObj = concertObjects.reduce((acc, concert) => {
            acc[concert.id] = concert;
            return acc;
          }, {});

          setSelectedConcerts(selectedConcertsObj);
        } else {
          // If there are no concerts in the list, set selectedConcerts to an empty object
          setSelectedConcerts({});
        }
      });
    } else {
      // If no list is selected, set selectedConcerts to an empty object
      setSelectedConcerts({});
    }
  }, [listId]);

  // function to handle list selection
  const handleListSelection = (selectedListId) => {
    setListId(selectedListId);
  }

  // function to handle removing a concert from a list
  const handleRemoveConcert = (concertId) => {
    // Get the selected list by listId
    const selectedList = lists.find((list) => list.id === listId);

    if (selectedList) {
      // creae a copy of concert list by spreading it
      const updatedConcerts = { ...selectedList.concerts };

      // remove concert by it's id
      delete updatedConcerts[concertId];

      // get the database and reference the concerts objectin firebase
      const database = getDatabase(app);
      const concertsRef = ref(database, `lists/${listId}/concerts`);

      // try to set the new updated concerts to the firebase database else catch error
      try {
        set(concertsRef, updatedConcerts);
        console.log(`Removed concert with ID ${concertId} from the list`);
      } catch (err) {
        console.error('Error removing concert:', err);
      }
    }
  }

  const handleDeleteList = (listId) => {
    // if there's a list by using it's id, find it in firebase
    if (listId) {
      const database = getDatabase(app);
      const listRef = ref(database, `lists/${listId}`);

      // try to remove the list, if not possible console.error
      try {
        remove(listRef);
        console.log(`Deleted list with ID ${listId} and associated concerts`);
        setListId('');
      } catch (err) {
        console.error('Error deleting list:', err);
      }
    }
  }

  const handlePublishList = (listId) => {
    // Move the list from 'lists' to 'published-lists' in firebase
    const database = getDatabase(app);
    const sourceListRef = ref(database, `lists/${listId}`)
    const publishedListRef = ref(database, `published-lists/${listId}`);

    onValue(sourceListRef, (snapshot) => {
      const listData = snapshot.val();
      if(listData) {
        // copy the list data to the published lists node
        set(publishedListRef, listData);

        // Delete the list from the source node
        remove(sourceListRef);

        // Optionally, you can update your local state to remove the list
        setLists((prevLists) => prevLists.filter((list) => list.id === listId));
      }
    })
  }

  console.log(selectedConcerts);

  return (
    <>
      <Link to="/published-lists">Published Lists</Link>
      <Routes>
        <Route path='/published-lists' element={ <PublishedLists /> } />
      </Routes>
      <FontAwesomeIcon icon={faGuitar} />
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
        <select onChange={(e) => handleListSelection(e.target.value)}>
          <option value="">Select a list</option>
          {lists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>

        {/* Display selected list's name, budget, and concerts */}
        {listId && (
          <div>
            <p>Selected List: {lists.find((list) => list.id === listId)?.name}</p>
            <p>Budget: {lists.find((list) => list.id === listId)?.budget}</p>
            <p>Concerts: </p>
            <ul>
              {Object.keys(
                lists.find((list) => list.id === listId)?.concerts || {}
                ).map((concertId) => (
                  <li key={concertId}>
                    Name: {lists.find((list) => list.id === listId)?.concerts[concertId]?.name}
                    <button onClick={() => handleRemoveConcert(concertId)}>Remove</button>
                  </li>
              ))}
            </ul>
            <button onClick={() => handleDeleteList(listId)}>Delete List</button>
            <button onClick={() => handlePublishList(listId)}>Publish List</button>
          </div>
        )}

        {/* {data.map((event) => (
          <div key={event.id}>
            <p >Title: {event.name}</p> */}
    
      <div className='wholePage'>
        {/* rename this class, its only the app not the body */}
        {/* Mapping over the data array and checking to see how to get all the info */}
        <div className='section1'>
          <div>
            <div>
              <p className='inputText'>Who do you want to see?</p>
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
              <p className='inputText'>When?</p>
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
        <ul className='section2'>
          <div className='upcomingShows'>
            <p>Upcoming Shows</p>
          </div>
    
        {data.slice(0, 5).map((event) => (
          <>
          <li key={event.id} className='results'>
            
    {/* Image */} 
            {event.images.length > 0 && (
              <div className='imgContainer'>
                <img src={event.images[0].url} alt={data.name} className='eventImg' />
              </div>
            )}
    <div className='concertInfo'>
    {/* Title */}
            <p className='eventName'>{event.name}</p>
    {/* Location */}
            <p className='eventLocation'>Location: {event._embedded.venues[0].name}</p>
    {/* Price */}
            {event.priceRanges && event.priceRanges.length > 0 ? (
              <>
                <p className='minPrice'>Min price: {event.priceRanges[0].min}</p>
                <p className='maxPrice'>Max price: {event.priceRanges[0].max}</p>
              </>
            ) : (
              <p>Price information not available</p>
            )}
            <p>Location: {event._embedded.venues[0].name}</p>
            {/* add button to each concert to send data to firebase list */}
            <button onClick={() => handleOnAdd(event)}>Add to list</button>
            {/* change state to show that concert was added and add error handling in case user tries to add concert again */}
    {/* Date */}
              <div className='eventContainer'>
                <p className='eventDate'>{event.dates.start.localDate}</p>
              </div>
    </div>
          </li>
        </>          
        ))}

        </ul>
        )}
        </div>
      </>
  )
}

export default App;

import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import { getDatabase, ref, onValue, push, set, remove } from 'firebase/database';
import app from './components/Firebase';
import { Routes, Link, Route, useLocation } from 'react-router-dom';
import PublishedLists from './components/PublishedLists';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGuitar } from '@fortawesome/free-solid-svg-icons';
import ListCreationForm from './components/ListCreationForm';
import Lists from './components/Lists';
import SearchAndResults from './components/SearchAndResults';
import Logo from './components/Logo';
import Home from './components/Home';


function App() {
  const location = useLocation();
  const isPublishedListsRoute = location.pathname === "./published-lists";
  const [listName, setListName] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedConcerts, setSelectedConcerts] = useState({});
  const [listId, setListId] = useState('');
  const [lists, setLists] = useState([]);
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); //default for now, switch after
  const [dateQuery, setDateQuery] = useState('');//for setting date instead


//   // Calling the api data with axios
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
    setDateQuery(e.target.value);
    initiateSearch(dateQuery)
  };
  //this code allows us to search another date without needing a clear button/state

  const handleDateSearch = () => {
    initiateSearch(dateQuery);
  };


  const initiateSearch = (selectedDate) => {
    const apiKey = `72U6GAMkp0CtJ8AT1AfsY8vvPRZZZBUk`;
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
      })
      .catch((error) => {
        console.error('Error getting that date information', error);
      });
  };

  // handle the form submission for the list name and budget along with any concerts being added
  // TO DO: need to handle error if user tries to enter a list with the same name!
  const handleSubmit = (listName, budget) => {
    // e.preventDefault();

    const listNameAndBudget = {
      name: listName,
      budget: budget,
    };

    // Send form name and budget to Firebase and get the generated list ID
    const database = getDatabase(app);
    const listRef = ref(database, 'lists');

    // make a new list reference and push the list name and budget
    try {
      const newListRef = push(listRef, listNameAndBudget);
      const listId = newListRef.key; // Get the generated list ID
      setListId(listId)
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
      // 
    }

    // Add selected concerts to Firebase under the same listId
    const database = getDatabase(app);
    const concertsRef = ref(database, `lists/${listId}/concerts`);


    try {
      push(concertsRef, events);
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
      // 
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

//   // function to handle removing a concert from a list
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


  return (
    <>
      <div className='publishedListsDiv'>
        <Routes>
          <Route path='/' element={ <Logo />} />
          <Route path='/published-lists' element={ <PublishedLists /> } />
          <Route path='/home' element={ <Home lists={lists} listId={listId} handleRemoveConcert={handleRemoveConcert} onDeleteList={handleDeleteList} handlePublishList={handlePublishList} onCreateList={handleSubmit} handleOnAdd={handleOnAdd} handleSearchInputChange={handleSearchInputChange} handleDateInputChange={handleDateInputChange} initiateSearch={initiateSearch} />}
          />
        </Routes>

          {/* Mapping over the data array and checking to see how to get all the info */}
          {/* Will likely change the structure to an unordered list */}
          {isPublishedListsRoute ? <PublishedLists /> : null}
        </div>
      </>
  )
}

export default App;

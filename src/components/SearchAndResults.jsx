import React, {useEffect, useState} from 'react'
import axios from 'axios'
import app from '../components/Firebase';
import { getDatabase, ref, update } from 'firebase/database';

const SearchAndResults = ({ handleOnAdd, handleSearchInputChange, handleDateInputChange, initiateSearch, listId }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateQuery, setDateQuery] = useState('');
    const [data, setData] = useState(null);
    const [iconVisible, setIconVisible] = useState({});
    const [addToListClicked, setAddToListClicked] = useState({});

    handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value)
        initiateSearch(searchQuery);
    }

    handleDateInputChange = (e) => {
        setDateQuery(e.target.value);
        initiateSearch(dateQuery)
    }

    
  const updateFirebaseIconVisibility = (listId, concertId, isVisible) => {
    // Get a reference to your Firebase database
    const database = getDatabase(app);

    // Reference to the specific concert's iconVisible property
    const concertIconVisibleRef = ref(database, `lists/${listId}/concerts/${concertId}/iconVisible`);

    // Update the iconVisible property
    update(concertIconVisibleRef, isVisible);
  };

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
        })
        .catch((error) => {
        console.error('error getting data', error);
        });
    }}, [searchQuery, dateQuery]) // this will refetch data when a search query is made

    initiateSearch = (selectedDate) => {
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

  return (
    <div>
        <div className='wholeApp'>
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
          <div className='orHighlite'><p>or</p></div>
          <div>
            <div>
              <p className='inputText'>When?</p>
            </div>
            <input
              type='date'
              placeholder='2023/01/01' //placeholder not working but doenst matter
              value={dateQuery}
              onChange={handleDateInputChange}
            />
          </div>
        </div>

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
            
            <div className='makingButtonNextToIcon'>
            {/* add button to each concert to send data to firebase list */}
              <button
              className='addToListButton'
              onClick={() => {
                handleOnAdd(event);
                const listId = '-NfK8eSyWU7AMY3jva8n'; // Replace with the actual list ID
                const concertId = event.id; // Assuming event.id can be used as concert ID
                setAddToListClicked((prevClicked) => ({
                  ...prevClicked,
                  [event.id]: !prevClicked[event.id],
                }));
                updateFirebaseIconVisibility(
                  listId,
                  concertId,
                  !addToListClicked[event.id]
                );
              }}
            >
              Add to list
            </button>
            {addToListClicked[event.id] && (
              <div className='guitarIconDiv'>
                <img src="./assets/guitar1.png" alt="guitar icon clicked" />
              </div>
            )}
            {/* Show the icon if iconVisible is true */}
            {event.iconVisible && (
              <div className='iconDiv'>
                <img src="icon-image.png" alt="Icon" />
              </div>
            )}
            {/* change state to show that concert was added and add error handling in case user tries to add concert again */}
            </div>
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
    </div>
  )
}

export default SearchAndResults
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import app from './Firebase';

const PublishedLists = () => {
    const [publishedLists, setPublishedLists] = useState([]);

    useEffect(() => {
        const database = getDatabase(app);
        const publishedListsRef = ref(database, 'published-lists');

        onValue(publishedListsRef, (snapshot) => {
            const listsData = snapshot.val();
            if (listsData) {
                const listsArray = Object.keys(listsData).map((key) => ({
                    id: key,
                    ...listsData[key],
                }))
                setPublishedLists(listsArray);
            }
        })
    }, [])

  return (
    <div className='publishedLists'>
        <div className='linkHome'>
            <Link className='linkHomeLink' to='/home'>Home</Link>
        </div>
        <h2>My Shows</h2>
        <ul>
            {publishedLists.map((list) => (
                <div key={list.id}>
                    <h3>{list.name} - Budget: ${list.budget}</h3>
                    {list.concerts && Object.keys(list.concerts).map((concertId) => (
                        // actual results
                        <li key={concertId} className='results'>
                        {/* Image  */}
                            {list.concerts[concertId] && (
                                <div className='imgContainer'>
                                    <img src={list.concerts[concertId].images[0].url} alt={list.concerts[concertId].name} />
                                </div>
                            )}
                            
                            <div> 
                                {/* need this div to make them flex downwards
                                even though no styles are being applied to it...??? */}

                            {/* Title */}
                                <p className='eventName'>{list.concerts[concertId].name}</p>
                                
                            {/* Location */}
                                <p className='eventDate'>location: {list.concerts[concertId]._embedded.venues[0].name}</p>
                            {/* Date */}
                                <p className='eventDate'>date: {list.concerts[concertId].dates.start.localDate}</p>

                                {/* Alex please fix */}
                            </div>
                            
                        </li>
                    ))}
                </div>
            ))}
        </ul>
    </div>
  )
}

export default PublishedLists
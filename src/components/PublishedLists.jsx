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
                <>
                {/* <div className='flexContainer'> */}
                <div className='eachBudgetContainer' key={list.id}>
                    <h3>{list.name} - Budget: ${list.budget}</h3>
                    {list.concerts && Object.keys(list.concerts).map((concertId) => (
                        // actual results
                        <>
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
                                <p className='eventLocation'>Location: {list.concerts[concertId]._embedded.venues[0].name}</p>
                            {/* Date */}
                                <p className='eventDate'>Date: {list.concerts[concertId].dates.start.localDate}</p>
                            {/* Prices */}
                                {list.concerts[concertId].priceRanges && list.concerts[concertId].priceRanges.length > 0 ? (
                                <>
                                    <p className='minPrice'>Min price: ${(list.concerts[concertId].priceRanges[0].min).toFixed(2)}</p>
                                    <p className='maxPrice'>Max price: ${(list.concerts[concertId].priceRanges[0].max).toFixed(2)}</p>
                                    
                                </>
                            ) : (
                            <p><i class="fa-solid fa-drum"></i>Price information not available at this time<i class="fa-solid fa-drum"></i></p>
                            )}
                            </div>
                        </li>
                        </>
                    ))}
                        {list.concerts && (
                            <>
                            <div className='remainingBudgetContainer'>
                                <p className='remainingBudgetMin'>
                                    Budget Remainig (Min Price Tickets): $
                                    {(list.budget - Object.keys(list.concerts).reduce((total, concertId) => {
                                        const minPrice =
                                            list.concerts[concertId]?.priceRanges?.[0]?.min || 0;
                                        return total + minPrice;
                                    }, 0)).toFixed(2)}
                                </p>
                                <p className='remainingBudgetMax'>
                                    Budget Remaining (Max Price Tickets): $
                                    {(list.budget - Object.keys(list.concerts).reduce((total, concertId) => {
                                        const maxPrice =
                                            list.concerts[concertId]?.priceRanges?.[0]?.max || 0;
                                        return total + maxPrice;
                                    }, 0)).toFixed(2)}
                                </p>
                            </div>
                            </>
                        )}
                    
                </div>
                </>
            ))}
        </ul>
        
    </div>
  )
}

export default PublishedLists
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
        <h2>Published Lists</h2>
        <Link to='/'>Home</Link>
        <ul>
            {publishedLists.map((list) => (
                <div key={list.id}>
                    <h3>{list.name} - Budget: ${list.budget}</h3>
                    {list.concerts && Object.keys(list.concerts).map((concertId) => (
                        <li key={concertId}>
                            <p>{list.concerts[concertId].name} - date: {list.concerts[concertId].date}</p>
                            {list.concerts[concertId] && (
                                <img src={list.concerts[concertId].images[0].url} alt={list.concerts[concertId].name} />
                            )}
                        </li>
                    ))}
                </div>
            ))}
        </ul>
    </div>
  )
}

export default PublishedLists
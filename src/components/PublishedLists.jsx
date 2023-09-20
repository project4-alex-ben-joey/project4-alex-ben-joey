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
    <div>\
        <Link to="/">Back to Home</Link>
        <h2>Published Lists</h2>
        <ul>
            {publishedLists.map((list) => (
                <li key={list.id}>
                    <Link to={`/published-list/${list.id}`}>{list.name}</Link>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default PublishedLists
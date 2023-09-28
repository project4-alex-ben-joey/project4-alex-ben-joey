import React, { useState } from 'react'

const ListCreationForm = ({ lists, onCreateList, onListSelection }) => {
    const [listName, setListName] = useState('');
    const [budget, setBudget] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreateList(listName, budget);
        setListName('');
        setBudget('');
    }

  return (
    <>
        <form className='listCreationForm' onSubmit={(e) => handleSubmit(e, listName, budget)}>
          <label htmlFor="name"></label>
          <input
            id='name' 
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder='Name your list'
            required 
          />
          <label htmlFor="budget"></label>
          <input
            className='PLBudget'
            id='budget' 
            type="number"
            min="1"
            max="10000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder='Set your budget'
            required
          />
          <button className='PLButton' type='submit'>Submit</button>
        </form>
        <select onChange={(e) => onListSelection(e.target.value)}>
          <option value="">Select a list</option>
          {lists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>
    </>
  )
}

export default ListCreationForm
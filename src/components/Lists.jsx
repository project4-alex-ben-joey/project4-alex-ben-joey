import React from 'react'

const Lists = ({ selectedList, lists, onRemoveConcert, onDeleteList, onPublishList }) => {
    console.log('selected list', selectedList)

  return (
    <div>
        {selectedList && (
          <div>
            <p>Selected List: {selectedList.name}</p>
            <p>Budget: {selectedList.budget}</p>
            <p>Concerts: </p>
            <ul>
              {Object.keys(
                selectedList.concerts || {}
                ).map((concertId) => (
                  <li key={concertId}>
                    {selectedList.concerts[concertId]?.name}
                    <button className='removeButton' onClick={() => onRemoveConcert(concertId)}>Remove</button>
                  </li>
              ))}
            </ul>
            <button className='deleteListButton' onClick={() => onDeleteList(selectedList.id)}>Delete List</button>
            &nbsp;&nbsp;
            <button className='publishListButton' onClick={() => onPublishList(selectedList.id)}>Publish List</button>
          </div>
        )}
    </div>
  )
}

export default Lists
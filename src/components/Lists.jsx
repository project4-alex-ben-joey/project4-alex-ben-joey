import React from 'react'

const Lists = ({ selectedList, lists, onRemoveConcert, onDeleteList, onPublishList }) => {

  return (
    <div>
        {selectedList && (
          <div>
            <p>Selected List: {selectedList.name}</p>
            <p>Budget: {selectedList.budget}</p>
            <p>Concerts: </p>
            <ul className='test-alex'>
              {Object.keys(
                selectedList.concerts || {}
                ).map((concertId) => (
                  <li className='selectAList-li' key={concertId}>
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
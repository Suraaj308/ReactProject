import './App.css';
import React, { useState, useEffect } from 'react';
import AddButton from './AddButton.js';

function App() {

  const [popUpOpen, setPopUpOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState();
  const [storeNote, setStoreNote] = useState('');

  const handleInputChange = (e) => {
    setStoreNote(e.target.value);
  };

  const handleNoteSubmit = () => {
    if (!currentGroup) {
      alert('Please select a group first!');
      return;
    }

    const storedGroups = JSON.parse(localStorage.getItem('groupDetails')) || [];

    const updatedGroups = storedGroups.map((group) => {
      if (group.groupName === currentGroup.groupName) {
        const updatedGroup = {
          ...group,
          groupNotes: group.groupNotes
            ? [
              ...group.groupNotes,
              { text: storeNote, timestamp: new Date().toISOString() }
            ]
            : [{ text: storeNote, timestamp: new Date().toISOString() }],
        };
        return updatedGroup;
      }
      return group;
    });

    localStorage.setItem('groupDetails', JSON.stringify(updatedGroups));
    setGroups(updatedGroups);

    const updatedCurrentGroup = updatedGroups.find(
      (group) => group.groupName === currentGroup.groupName
    );
    setCurrentGroup(updatedCurrentGroup);

    setStoreNote('');
  };


  const handleAddButton = () => {
    setPopUpOpen(prevState => !prevState);
  };
  const closeAddButton = () => {
    setPopUpOpen(false);
  };

  const updateGroups = () => {
    const storedGroups = JSON.parse(localStorage.getItem('groupDetails')) || [];
    setGroups(storedGroups);
  };

  const handleGroupClick = (group) => {
    setCurrentGroup(group);
  };

  useEffect(() => {
    const storedGroups = JSON.parse(localStorage.getItem('groupDetails')) || [];
    setGroups(storedGroups);
  }, []);

  return (
    <div className="fullscreen-div">
      <div className="l1">
        <div className="sl1 l11">Pocket Notes</div>
        <div className="sl1 l12">
          {groups.length > 0 ? (
            groups.map((group, index) => (
              <div key={index} className="group-div" onClick={() => handleGroupClick(group)}>
                <div className="group-short" style={{ backgroundColor: group.groupColor }}>
                  {group.groupShort}
                </div>
                <div className="group-name">
                  {group.groupName}
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
        <div className="sl1 l13">
          <button onClick={handleAddButton} className="groupAdd-button">+</button>
        </div>
      </div>
      <div className="r1">
        <div className='sr1 r11'>
          {currentGroup ? (
            <div className='sr1 r11 r1'>
              <span style={{ backgroundColor: currentGroup.groupColor }}>
                {currentGroup.groupShort}
              </span>
              <span>{currentGroup.groupName}</span>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className='sr1 r12'>
          {popUpOpen && <AddButton onClose={closeAddButton} onGroupAdded={updateGroups} />}
          {currentGroup && currentGroup.groupNotes ? (
            <div>
              {currentGroup.groupNotes.map((note, index) => (
                <div key={index} className="note-text">
                  <p className='textnotes'>{note.text}</p>
                  <small classname='timestamps'>{new Date(note.timestamp).toLocaleString()}</small>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <img
                src={`${process.env.PUBLIC_URL}/notes-image.png`}
                alt="Description of image"
                style={{ width: '700px', height: 'auto', marginBottom: '10px' }}
              />
              <h1 className='noteHeading'>Pocket Notes</h1>
              <p className='noteFooter'>Send and receive messages without keeping your phone online.<br />
                Use Pocket Notes on up to 4 linked devices and 1 mobile phone.
              </p>
            </div>
          )}
        </div>
        <div className='sr1 r13'>
          {currentGroup ? (
            <div className='bg-textarea'>
              <textarea
                value={storeNote}
                onChange={handleInputChange}
                placeholder="Enter your text here......."
                className="note-textarea"
                rows="5"
              ></textarea>
              <button onClick={handleNoteSubmit} className="submit-button">
                Submit
              </button>
            </div>
          ) : (
            <span>end to end encrypted</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

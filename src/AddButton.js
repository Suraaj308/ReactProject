import React, { useState, useEffect } from 'react';
import './AddButton.css';

function AddButton({ onClose, onGroupAdded }) {

    const [note, setNote] = useState('');
    const [groupColor, setGroupColor] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setNote(e.target.value);
        setError('');
    };

    const handleColorClick = (color) => {
        setGroupColor(color);
        setError('');
    };


    const handleSubmit = () => {
        const storedGroups = JSON.parse(localStorage.getItem('groupDetails')) || [];

        if (!note.trim()) {
            setError('Please enter a group name.');
            return;
        }
        if (!groupColor) {
            setError('Please choose a color.');
            return;
        }

        const isDuplicate = storedGroups.some((group) => group.groupName.toLowerCase() === note.trim().toLowerCase());
        if (isDuplicate) {
            setError('A group with this name already exists. Please choose a different name.');
            return;
        }

        const groupShort = note.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
        const groupObject = {
            groupName: note,
            groupColor: groupColor,
            groupShort: groupShort,
            groupNotes: []
        };
        const theGroupDetails = JSON.parse(localStorage.getItem('groupDetails')) || [];
        theGroupDetails.push(groupObject);
        localStorage.setItem('groupDetails', JSON.stringify(theGroupDetails));

        onGroupAdded();
        setNote('');
        setError('');
        setGroupColor('');
        onClose();
    };

    const handleOutsideClick = (e) => {
        if (e.target.className === 'popup-card') {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div className="popup-card">
            <div className="popup-content">
                <h3>Create New Group</h3>
                {error && <p className="error-message">{error}</p>}
                <div>
                    <span>Group Name : </span>
                    <input
                        type="text"
                        value={note}
                        onChange={handleInputChange}
                        placeholder="Enter your note here..."
                    />
                </div>
                <div>
                    <span>Choose color : </span>
                    <div className="color-options">
                        {['#b38bfa', '#ff79f2', '#43e6fc', '#f19576', '#0047ff', '#6691ff'].map((color) => (
                            <button
                                key={color}
                                className={`color-circle ${groupColor === color ? 'selected' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorClick(color)}
                            ></button>
                        ))}
                    </div>
                </div>
                <div className="popup-buttons">
                    <button onClick={handleSubmit}>Create</button>
                </div>
            </div>
        </div>
    )
}

export default AddButton;
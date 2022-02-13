export const MongoDBGetNotes = () => {
    return fetch(`/notes`).then(res => res.json());
};

export const MongoDBFetchStates = () => {
    return fetch(`/states`).then(res => res.json());
};

export const MongoDBAddSTates = currentUser => {
    return fetch(`/states/add`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            length: 0,
            currentlyRendering: "All",
            login: currentUser,
        }),
    });
};

export const MongoDBUpdateNoteValue = (id, value, notes, noteIndex, currentUser) => {
    return Promise.resolve(
        fetch(`/notes/update/${id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                text: value,
                isActive: notes[noteIndex].isActive,
                login: currentUser,
            }),
        }),
    );
};

export const MongoDBDeleteNote = id => {
    return fetch(`/notes/${id}`, {
        method: "DELETE",
    });
};

export const MongoDBDeleteNotesInOrder = async notes => {
    const elToDelet = await notes.filter(note => !note.isActive && note);

    return await elToDelet.forEach(arg => {
        MongoDBDeleteNote(arg._id);
    });
};

export const MongoDBDecrementStateLength = (notesLeft, currentUser) => {
    return fetch(`/states/update`, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            length: notesLeft - 1,
            login: currentUser,
        }),
    });
};

export const MongoDBUpdateActiveState = (id, notes, isActiveState, noteIndex, currentUser) => {
    return fetch(`/notes/update/${id}`, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            text: notes[noteIndex].text,
            isActive: !isActiveState,
            login: currentUser,
        }),
    });
};

export const MongoDBPatchStatesLength = (isActiveState, currentUser, notesLeft, currentlyRendering) => {
    return fetch(`/states/update`, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            length: isActiveState ? notesLeft - 1 : notesLeft + 1,
            login: currentUser,
            currentlyRendering: currentlyRendering
        }),
    });
};

export const MongoDBMarkAllNotesDone = (notes, currentUser, notesLeft, currentlyRendering) => {
    const markALLNotesDone = async() => {
        await notes.forEach(note => {
            fetch(`/notes/update/${note._id}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    _id: note._id,
                    text: note.text,
                    isActive: notesLeft ? false : true,
                    login: currentUser,
                }),
            });
        });
    }
    return markALLNotesDone()
    .then(() => {
        fetch(`/states/update`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                length: notesLeft ? 0 : notes.length,
                currentlyRendering: currentlyRendering,
                login: currentUser,
            }),
        });
    })
};

export const MongoDBLogoutUser = () => {
    return fetch("/users/logout")
            .then(res => res.json())
            .then(data => console.log(data))
            .then(() => window.location.reload());
}


const title = document.querySelector(".note__title");
const note = document.querySelector(".note");
const addNoteBttn = document.querySelector("#add__note");
const notesContainer = document.querySelector(".notes");
const tabBttn = document.querySelectorAll(".bttn");
const inputEl = document.querySelector(".search__input");
const alert = document.querySelector(".alert");

let editFlag = false;
let editId = "";

const addNotes = () => {
  let notes = localStorage.getItem("notes");
  if (notes === null) {
    notes = [];
  } else {
    notes = JSON.parse(notes);
  }

  if (!note.value) {
    displayAlert("please enter value", "danger");
    return;
  }

  if (!editFlag) {
    const noteObj = {
      title: title.value,
      note: note.value,
    };

    notes.push(noteObj);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();

    displayAlert("Note added to the list", "success");

    title.value = "";
    note.value = "";
  } else if (editFlag) {
    notes[editId].title = title.value;
    notes[editId].note = note.value;
    console.log(notes, ";;;");
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    displayAlert("Note updated", "success");
    setBackToDefault();
  }
};

const showNotes = (data) => {
  let notes = localStorage.getItem("notes");
  if (notes == null) {
    return;
  } else if (data) {
    notes = data;
  } else {
    notes = JSON.parse(notes);
  }

  let notesHTML =
    notes.length > 0
      ? notes
          .map((item, index) => {
            const { title, note } = item;
            return `<div class="note__box">		
                  <div class="note_info">
                  <h2 class="title">${title === "" ? "Note" : title}</h2>
                  <p class="text">${note}</p>
                </div>
    
                <div class="btn__container">
                  <button data-id=${index}  class="edit__btn"> <i class="fas fa-edit"></i></button>
                  <button data-id= ${index} class="del__btn"> <i class="fas fa-trash"></i></button>
                </div>
              </div>`;
          })
          .join(" ")
      : `<p class="result">No results found</p>`;

  notesContainer.innerHTML = notesHTML;
  const deleteBttn = notesContainer.querySelectorAll(".del__btn");
  const editBttn = notesContainer.querySelectorAll(".edit__btn");
  deleteBttn.forEach((bttn) => {
    bttn.addEventListener("click", (e) => {
      let activeTabe = "all";
      let keyNote = "notes";
      deleteNote(e, activeTabe, keyNote);
    });
  });

  editBttn.forEach((bttn) => {
    bttn.addEventListener("click", (e) => {
      selectEditNote(e);
    });
  });
};

const deleteNote = (e, activeTabe, keyNote) => {
  const value = e.currentTarget.dataset.id;

  // All notes
  let notes = localStorage.getItem(keyNote);
  if (notes === null) {
    return;
  } else {
    notes = JSON.parse(notes);
  }

  if (activeTabe === "all") {
    // Archive notes
    setArchiveNote(notes, value);

    notes.splice(value, 1);

    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    displayAlert("Move to Archive", "danger");
  }

  if (activeTabe === "archive") {
    notes.splice(value, 1);
    localStorage.setItem("archive-notes", JSON.stringify(notes));
    showArchiveNotes();
    displayAlert("Note Removed", "danger");
  }
};

const selectEditNote = (e) => {
  const value = e.currentTarget.dataset.id;
  let notes = localStorage.getItem("notes");
  if (notes === null) {
    return;
    ``;
  } else {
    notes = JSON.parse(notes);
  }

  editFlag = true;
  editId = +e.currentTarget.dataset.id;
  addNoteBttn.textContent = "Edit";

  let selectedNote = notes?.findIndex((_, i) => i === +value);

  title.value = notes[selectedNote].title;
  note.value = notes[selectedNote].note;
};

const showArchiveNotes = () => {
  let notes = localStorage.getItem("archive-notes");
  if (notes == null) {
    return;
  } else {
    notes = JSON.parse(notes);
  }
  let notesHTML =
    notes.length > 0
      ? notes
          .map((item, index) => {
            const { title, note } = item;
            return `<div class="note__box">		
                  <div class="note_info">
                  <h2 class="title">${title === "" ? "Note" : title}</h2>
                  <p class="text">${note}</p>
                </div>
                <div class="btn__container">
                <button data-id= ${index} class="restore__btn"> <i class="fa fa-rotate-left"></i></button>
                <button data-id= ${index} class="del__btn"> <i class="fas fa-trash"></i></button>
              </div>
              </div>`;
          })
          .join(" ")
      : `<p class="result">No results found</p>`;

  notesContainer.innerHTML = notesHTML;
  const deleteBttn = notesContainer.querySelectorAll(".del__btn");
  const restoreBttn = notesContainer.querySelectorAll(".restore__btn");
  deleteBttn.forEach((bttn) => {
    bttn.addEventListener("click", (e) => {
      let activeTabe = "archive";
      let keyNote = "archive-notes";
      deleteNote(e, activeTabe, keyNote);
    });
  });

  restoreBttn.forEach((bttn) => {
    bttn.addEventListener("click", (e) => {
      restoreNote(e);
    });
  });
};

function setArchiveNote(notes, value) {
  let deletedArray = localStorage.getItem("archive-notes");
  if (deletedArray === null) {
    deletedArray = [];
  } else {
    deletedArray = JSON.parse(deletedArray);
  }

  deletedArray.push(notes[value]);
  localStorage.setItem("archive-notes", JSON.stringify(deletedArray));
}

addNoteBttn.addEventListener("click", addNotes);

window.addEventListener("DOMContentLoaded", () => {
  showNotes();
});

tabBttn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const target = e.target.dataset.label;
    if (target) {
      tabBttn.forEach((btn) => {
        btn.classList.remove("active");
      });

      e.target.classList.add("active");
    }

    if (target === "all") {
      inputEl.classList.remove("hide");

      showNotes();
    } else if (target === "archive") {
      inputEl.classList.add("hide");
      showArchiveNotes();
    }
  });
});

inputEl.addEventListener("input", (e) => {
  const target = e.target.value;
  let notes = localStorage.getItem("notes");
  if (notes == null) {
    return;
  } else {
    notes = JSON.parse(notes);
  }

  let data = notes.filter((n) => {
    return n.note.includes(target);
  });

  showNotes(data);
});

function restoreNote(e) {
  let value = e.currentTarget.dataset.id;
  // Archive notes
  let notes = localStorage.getItem("archive-notes");
  if (notes == null) {
    return;
  } else {
    notes = JSON.parse(notes);
  }

  //All notes
  let Allnotes = localStorage.getItem("notes");
  if (Allnotes == null) {
    return;
  } else {
    Allnotes = JSON.parse(Allnotes);
  }
  let noteData = notes.filter((_, i) => i === +value);

  let data = [...Allnotes, ...noteData];
  localStorage.setItem("notes", JSON.stringify(data));

  notes.splice(value, 1);
  localStorage.setItem("archive-notes", JSON.stringify(notes));

  showArchiveNotes();
}

function setBackToDefault() {
  editFlag = false;
  addNoteBttn.textContent = "Add";
  title.value = "";
  note.value = "";
}

function displayAlert(text, action) {
  alert.classList.add("show");
  alert.textContent = text;

  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove("show");
  }, 1000);
}

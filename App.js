const title = document.querySelector(".note__title");
const note = document.querySelector(".note");
const addNoteBttn = document.querySelector("#add__note");
const notesContainer = document.querySelector(".notes");
const tabBttn = document.querySelectorAll(".bttn");
const inputEl = document.querySelector(".search__input");

const addNotes = () => {
  let notes = localStorage.getItem("notes");
  if (notes === null) {
    notes = [];
  } else {
    notes = JSON.parse(notes);
  }

  if (!note.value) {
    alert("add your note");
    return;
  }

  const noteObj = {
    title: title.value,
    note: note.value,
  };

  notes.push(noteObj);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();

  title.value = "";
  note.value = "";
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
  deleteBttn.forEach((bttn) => {
    bttn.addEventListener("click", (e) => {
      let activeTabe = "all";
      let keyNote = "notes";
      deleteNote(e, activeTabe, keyNote);
    });
  });
};

const deleteNote = (e, activeTabe, keyNote) => {
  const value = e.currentTarget.dataset.id;

  console.log(activeTabe, keyNote);
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
  }

  if (activeTabe === "archive") {
    notes.splice(value, 1);

    localStorage.setItem("archive-notes", JSON.stringify(notes));
    showArchiveNotes();
  }
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
            console.log(title, note);
            return `<div class="note__box">		
                  <div class="note_info">
                  <h2 class="title">${title === "" ? "Note" : title}</h2>
                  <p class="text">${note}</p>
                </div>
                <div class="btn__container">
                <button data-id= ${index} class="del__btn"> <i class="fas fa-trash"></i></button>
              </div>
              </div>`;
          })
          .join(" ")
      : `<p class="result">No results found</p>`;

  notesContainer.innerHTML = notesHTML;
  const deleteBttn = notesContainer.querySelectorAll(".del__btn");
  deleteBttn.forEach((bttn) => {
    console.log(bttn);
    bttn.addEventListener("click", (e) => {
      let activeTabe = "archive";
      let keyNote = "archive-notes";
      deleteNote(e, activeTabe, keyNote);
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

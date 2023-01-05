const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = 3001;
const uuid = require("./helpers/uuid");
const app = express();
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

app.get("/api/notes", (req, res) =>
  fs.readFile(path.join("./db/db.json"), (err, notes) => {
    if (err) {
      return console.log(err);
    }
    res.json(JSON.parse(notes));
  })
);
app.post("/api/notes", (req, res) => {
  const notebody = req.body;
  fs.readFile(path.join(__dirname, "/db/db.json"), (err, notes) => {
    if (err) {
      return console.log(err);
    }
    notes = JSON.parse(notes)
    
    const newNote = {
      title: notebody.title,
      text: notebody.text,
      id: uuid(),
    };

    let newNotesDb  = notes.concat(newNote)

    fs.writeFile(
      path.join(__dirname, "/db/db.json"),
      JSON.stringify(newNotesDb),
      (err, notes) => {
        if (err) {
          return console.log(err);
        }
  
        res.json(newNotesDb);
      }
    );
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

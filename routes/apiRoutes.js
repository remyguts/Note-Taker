"use strict";

const fs = require("fs");
const path = require("path");

const dbNotes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../db/db.json"), (err, data) => {
    if (err) throw err;
  })
);

const newNotes = dbNotes => {
  fs.writeFileSync(
    path.join(__dirname, "../db/db.json"),
    JSON.stringify(dbNotes),
    err => {
      if (err) throw err;
    }
  );
};

module.exports = app => {
  app.get("/api/notes", function(req, res) {
    return res.json(dbNotes);
  });

  app.post("/api/notes", function(req, res) {
    let note = req.body;
    let id = dbNotes.length;
    note.id = id + 1;
    dbNotes.push(note);
    newNotes(dbNotes);
    return res.json(dbNotes);
  });
  app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id;
    let interval = 1;
    dbNotes.splice(`${id - 1}`, 1);
    for (let i = 0; i < dbNotes.length; ++i) {
      dbNotes[i].id = interval;
      interval = interval + 1;
    }
    newNotes(dbNotes);
    res.send(dbNotes);
  });
};

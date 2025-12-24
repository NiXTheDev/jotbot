-- Photo Table
CREATE TABLE IF NOT EXISTS photo_db (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entryId INTEGER NOT NULL, -- Entry ID that photo is attatched to
    path TEXT NOT NULL,
    caption TEXT,
    fileSize INTEGER NOT NULL,
    FOREIGN KEY (entryId) REFERENCES journal_db(id) ON DELETE CASCADE
);
-- User Table
CREATE TABLE IF NOT EXISTS user_db (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegramId INTEGER UNIQUE,
    username TEXT NOT NULL UNIQUE,
    dob INTEGER NOT NULL,
    joinedDate INTEGER NOT NULL
);

-- Create user settings when a new user is created
CREATE TRIGGER insert_user_settings AFTER INSERT ON user_db BEGIN
    INSERT INTO settings_db (userId) VALUES (telegramId);
END;
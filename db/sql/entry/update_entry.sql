UPDATE OR FAIL entry_db SET 
    lastEditedTimestamp = ?, 
    situation = ?, 
    automaticThoughts = ?, 
    emotionName = ?, 
    emotionEmoji = ?, 
    emotionDescription = ? 
    WHERE id = <ID>;
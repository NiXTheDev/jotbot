export const startString: string = `Hello!  Welcome to JotBot.  I'm here to help you record your emotions and emotion!`;
export const helpString: string = `This is a help message, I hope its helpful!!`;
export const telegramDownloadUrl = "https://api.telegram.org/file/bot<token>/<file_path>";

export const crisisString = 
`
Hello <username> here are the crisis help lines.
🚨<b><u>PLEASE CALL IF YOU FEEL YOU MIGHT HURT YOURSELF OR OTHERS</u></b>🚨

<b><u>CRISIS LINES</u></b>
- 988 <b>Mental health crisis line</b>
- 1-800-273-8255 <b>National Suicide Prevention Lines</b>

<b><u>Immediate Help via text</u></b>
Text the word <b>HOME</b> to 741741 to connect with <b>Crisis Text Line</b>

🏳️‍🌈 <b><u>LGBTQ+ Resources</u></b> 🏳️‍🌈
Councelors specializing in LGBTQ+
- 1-800-488-7386 <b>The Trevor Project</b>

<b><u>Sexual Assault Resources</u></b>
- 1-800-799-7233

<b><u>Veteran Resources</u></b>
1-877-927-8387 <b>24/7 Veteran Combat Call center to speak with another combat veteran</b>

<b><u>Life Threatening Emergencies</u></b>
Call 911
`

export enum Emotions {
    VERY_SAD = "very-sad",
    SAD = "sad",
    MEH = "meh",
    HAPPY = "happy",
    VERY_HAPPY = "very-happy"
}
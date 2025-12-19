import { Entry } from "../types/types.ts";
import { getAllEntriesByUserId } from "../models/entry.ts";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function entryFromString(entryString: string): Entry {
  try {
    const emotion = entryString.match(
      /(?<=Emotion)[\S\s]*(?=Emotion Description)/,
    )?.toString().trim();
    const emotionDescription = entryString.match(
      /(?<=Emotion Description)[\S\s]*(?=Situation)/,
    )?.toString().trim();
    const situation = entryString.match(
      // /(?<=Situation[\S\s]*).*(?=[\S\s]*Automatic Thoughts)/,
      /(?<=Situation)[\S\s]*(?=Automatic Thoughts)/,
    )?.toString().trim();
    const automaticThoughts = entryString.match(
      // /(?<=Automatic Thoughts[\S\s]*).*(?=[\S\s]*Page.*)/,
      /(?<=Automatic Thoughts)[\S\s]*(?=Page.*)/,
    )?.toString().trim();
    const emotionArr = emotion!.split(" ");
    const emotionName = emotionArr[0], emotionEmoji = emotionArr[1];

    console.log(emotionArr);

    return {
      userId: 0,
      emotion: {
        emotionName: emotionName,
        emotionEmoji: emotionEmoji,
        emotionDescription: emotionDescription!,
      },
      situation: situation!,
      automaticThoughts: automaticThoughts!,
      selfiePath: null,
    };
  } catch (err) {
    throw new Error(`Failed to build entry from string: ${err}`);
  }
}

export async function dropOrphanedSelfies() {
  const entries = getAllEntriesByUserId(779473861);
  const selfiePaths: string[] = [];
  for (const entry in entries) {
    if (!entries[entry].selfiePath) continue;
    selfiePaths.push(entries[entry].selfiePath!);
  }

  const dateTimes: string[][] = [];
  for (const path in selfiePaths) {
    const date = selfiePaths[path].split("_")[1];
    const time = selfiePaths[path].split("_")[2];
    const dateTime = [];
    dateTime.push(date, time);
    dateTimes.push(dateTime);
  }

  const dateTimeStrings = [];
  for (const dateTime in dateTimes) {
    dateTimeStrings.push(new RegExp(dateTimes[dateTime].join("_")));
  }

  for await (const dirEntry of Deno.readDir("assets/selfies")) {
    for (const regex in dateTimeStrings) {
      if (!dateTimeStrings[regex].test(dirEntry.name)) {
        Deno.remove(`assets/selfies/${dirEntry.name}`);
      }
    }
  }
}

export function entryToString(entry: Entry): string {
  return `
<b>Date Created</b> ${new Date(entry.timestamp!).toLocaleString()}
${
    entry.lastEditedTimestamp
      ? new Date(entry.lastEditedTimestamp).toLocaleString()
      : ""
  }
<b><u>Emotion</u></b>
${entry.emotion.emotionName} ${entry.emotion.emotionEmoji || ""}
  // Show first entry in list
<b><u>Emotion Description</u></b>
${entry.emotion.emotionDescription}

<b><u>Situation</u></b>
${entry.situation}

<b><u>Automatic Thoughts</u></b>
${entry.automaticThoughts}
`;
}

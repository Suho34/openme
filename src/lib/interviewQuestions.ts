export interface InterviewQuestion {
  id: string;
  question: string;
  hint: string;
}

/**
 * A short, static interview. Deliberately not AI-generated: questions appear
 * instantly, cost nothing, and the AI is saved for turning answers into prose.
 */
const PARTNER: InterviewQuestion[] = [
  {
    id: "small-things",
    question: "What's something small they do that you'd miss terribly if it disappeared?",
    hint: "A habit, a phrase, the way they make tea, how they fall asleep mid-sentence.",
  },
  {
    id: "one-day",
    question: "Tell me about one day with them you'd happily live again.",
    hint: "Where were you, what happened, what made it stick?",
  },
  {
    id: "unwatched",
    question: "What are they like when nobody else is watching?",
    hint: "The version of them only you get to see.",
  },
  {
    id: "carried",
    question: "What did they help you carry this year?",
    hint: "A hard week, a decision, a fear — big or unglamorous.",
  },
  {
    id: "inside",
    question: "What's the thing only the two of you understand?",
    hint: "An inside joke, a ritual, a nickname, a look across a room.",
  },
  {
    id: "next-year",
    question: "What do you hope this next year gives them?",
    hint: "Something specific and true, not 'happiness and success'.",
  },
];

const FRIEND: InterviewQuestion[] = [
  {
    id: "first-thing",
    question: "What's the first thing you'd tell them if you called them right now?",
    hint: "Whatever comes out — the AI will keep your voice.",
  },
  {
    id: "chaos",
    question: "What's the most ridiculous thing you two have survived together?",
    hint: "The story you still can't tell without laughing.",
  },
  {
    id: "always",
    question: "When has this person shown up for you without being asked?",
    hint: "A move, a 2am call, a silence that helped.",
  },
  {
    id: "annoying",
    question: "What do they do that's slightly annoying and secretly one of your favourite things?",
    hint: "Affectionate teasing works better than perfection.",
  },
  {
    id: "inside",
    question: "What's an inside joke or phrase that would make them laugh immediately?",
    hint: "Even one word can carry ten years.",
  },
  {
    id: "wish",
    question: "What do you actually want for them this year?",
    hint: "The honest answer, not the card-shop one.",
  },
];

const FAMILY: InterviewQuestion[] = [
  {
    id: "childhood",
    question: "What's an early memory of them that still makes you smile?",
    hint: "A kitchen, a car ride, a holiday, a shared bedroom.",
  },
  {
    id: "taught",
    question: "What did they teach you without ever sitting you down to teach it?",
    hint: "A way of handling people, money, bad news, or Sunday mornings.",
  },
  {
    id: "ordinary",
    question: "What ordinary thing about them do you rely on more than you say?",
    hint: "The call, the food, the fixing of things.",
  },
  {
    id: "proud",
    question: "When were you proudest of them?",
    hint: "It doesn't have to be a big milestone.",
  },
  {
    id: "say-now",
    question: "What have you been meaning to say to them but haven't?",
    hint: "This is the one that usually ends up in the letter.",
  },
  {
    id: "hope",
    question: "What do you wish for their year ahead?",
    hint: "Health, rest, a specific dream finally landing.",
  },
];

const COLLEAGUE: InterviewQuestion[] = [
  {
    id: "working",
    question: "What's it actually like working with them on a hard day?",
    hint: "The calm, the jokes, the fix they always seem to find.",
  },
  {
    id: "learned",
    question: "What have you learned from watching them work?",
    hint: "A habit, a phrase, how they handle pressure.",
  },
  {
    id: "memory",
    question: "What's a work moment you both still bring up?",
    hint: "A launch, a disaster, a very long Tuesday.",
  },
  {
    id: "lifted",
    question: "When did they make your job easier without making a thing of it?",
    hint: "Cover, credit, a quiet heads-up.",
  },
  {
    id: "outside",
    question: "What do you know about them outside of work that you admire?",
    hint: "Something they've built, raised, or kept going.",
  },
  {
    id: "wish",
    question: "What do you hope this year brings them?",
    hint: "Warm and genuine, still workplace-appropriate.",
  },
];

const RELATIONSHIPS: Record<string, InterviewQuestion[]> = {
  partner: PARTNER,
  friend: FRIEND,
  "best-friend": FRIEND,
  family: FAMILY,
  sibling: FAMILY,
  colleague: COLLEAGUE,
};

export function questionsFor(relationshipId: string): InterviewQuestion[] {
  return RELATIONSHIPS[relationshipId] ?? FRIEND;
}

/** Feeds the prompt with only the questions that were actually answered. */
export function answeredPairs(
  questions: InterviewQuestion[],
  answers: Record<string, string>,
): { question: string; answer: string }[] {
  return questions
    .filter((q) => (answers[q.id] ?? "").trim().length > 2)
    .map((q) => ({ question: q.question, answer: answers[q.id].trim() }));
}

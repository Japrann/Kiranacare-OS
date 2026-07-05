export const bootLines = [
  "Initializing...",
  "Loading Care Module...",
  "Checking Princess Status...",
  "Ready.",
];

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return {
      title: "Good Morning, Kirana",
      emoji: "☀️",
      subtitle: "I hope today treats you gently.",
    };
  }
  if (hour >= 12 && hour < 17) {
    return {
      title: "Good Afternoon, Kirana",
      emoji: "🌼",
      subtitle: "I hope you're taking it slow.",
    };
  }
  if (hour >= 17 && hour < 21) {
    return {
      title: "Good Evening, Kirana",
      emoji: "🌇",
      subtitle: "I hope the day was kind to you.",
    };
  }
  return {
    title: "Good Night, Kirana",
    emoji: "🌙",
    subtitle: "I hope you rest well tonight.",
  };
}

export const secretMessages = [
  "Someone is hoping you're smiling today.",
  "If you're tired, it's okay to rest.",
  "Don't forget to drink water.",
  "Have fun, but don't skip meals.",
  "You don't have to earn rest. Just take it.",
  "Wherever you are right now, I hope it feels soft.",
  "No agenda today. Just you, taken care of.",
  "This is your permission slip to do absolutely nothing.",
];

// Deterministic pick so the message feels like it "changes every few hours"
// rather than randomly on every refresh.
export function getSecretMessage(date = new Date()) {
  const slot = Math.floor(date.getTime() / (1000 * 60 * 60 * 3)); // 3-hour slots
  const index = slot % secretMessages.length;
  return secretMessages[index];
}

export const checklistDefaults = [
  { id: "breakfast", label: "Breakfast", emoji: "🍳" },
  { id: "lunch", label: "Lunch", emoji: "🍚" },
  { id: "dinner", label: "Dinner", emoji: "🍽️" },
  { id: "water", label: "Drink enough water", emoji: "💧" },
  { id: "rest", label: "Rest well", emoji: "🌙" },
  { id: "enjoy", label: "Enjoy your day", emoji: "🌸" },
];

export const catLines = {
  cila: [
    "Cila says: Feed yourself too.",
    "Cila says: Did you drink water yet?",
    "Cila says: You deserve a little nap.",
    "Cila is watching. Rest, please.",
  ],
  zoro: [
    "Zoro is checking if you've eaten.",
    "Zoro says: Slow down, princess.",
    "Zoro wants you to rest a little.",
    "Zoro approves of doing nothing today.",
  ],
};

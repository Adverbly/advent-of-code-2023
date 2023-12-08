const order = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
].reverse();

const handCompositions = {
  [JSON.stringify([5])]: { strength: 7, label: "5k" },
  [JSON.stringify([4, 1])]: { strength: 6, label: "4k" },
  [JSON.stringify([3, 2])]: { strength: 5, label: "fhk" },
  [JSON.stringify([3, 1, 1])]: { strength: 4, label: "3k" },
  [JSON.stringify([2, 2, 1])]: { strength: 3, label: "2p" },
  [JSON.stringify([2, 1, 1, 1])]: { strength: 2, label: "p" },
  [JSON.stringify([1, 1, 1, 1, 1])]: { strength: 1, label: "h" },
} as Record<string, { strength: number; label: string }>;

const solve = (lines: string[]) => {
  const hands = lines.map((line) => {
    const [cardsStr, bidStr] = line.split(" ");
    const cards = cardsStr.split("");
    const cardsOrdinal = cards.map((c) => order.indexOf(c));
    const cardMap: Record<string, number> = {};
    const cardsWithoutJokers = cards.filter((c) => c !== "J");
    const jokers = cards.filter((c) => c === "J");

    cardsWithoutJokers.forEach((c) => {
      if (cardMap[c]) {
        cardMap[c] += 1;
      } else {
        cardMap[c] = 1;
      }
    });

    const sortedCardCounts = Object.values(cardMap).sort().reverse();
    if (jokers.length === 5) {
      sortedCardCounts.push(5);
    } else {
      jokers.forEach(() => {
        sortedCardCounts[0] += 1;
      });
    }

    const hand = handCompositions[JSON.stringify(sortedCardCounts)];

    return {
      cards,
      cardsOrdinal,
      hand,
      bid: Number(bidStr),
    };
  });

  const sortedHands = hands.sort((lHand, rHand) => {
    if (lHand.hand.strength > rHand.hand.strength) {
      return 1;
    } else if (rHand.hand.strength > lHand.hand.strength) {
      return -1;
    } else {
      for (const [index, lCard] of lHand.cardsOrdinal.entries()) {
        const rCard = rHand.cardsOrdinal[index];
        if (lCard > rCard) {
          return 1;
        } else if (rCard > lCard) {
          return -1;
        }
      }
      return 0;
    }
  });

  const result = sortedHands.reduce((sum, line, index) => {
    return sum + line.bid * (index + 1);
  }, 0);

  console.log(result);
};
// const inputFile = Bun.file(import.meta.dir + "/example.txt");
const inputFile = Bun.file(import.meta.dir + "/../input.txt");
const input = await inputFile.text();
const lines = input.split("\n");
lines.pop(); // remove trailing newline :(

const start = Bun.nanoseconds();
solve(lines); // yay for top-level await!
const end = Bun.nanoseconds();
console.log(`duration: ${end - start}ns`);

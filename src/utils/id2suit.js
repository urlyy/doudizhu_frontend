const suits = [
    { suit: "♠", color: "black" },
    { suit: "♣", color: "black" },
    { suit: "♦", color: "red" },
    { suit: "♥", color: "red" },
    { suit: "JOKER小", color: "black" },
    { suit: "JOKER大", color: "red" },
]

const getSuit = (id) => {
    return suits[id];
}   
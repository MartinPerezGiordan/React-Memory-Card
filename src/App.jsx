import { useEffect, useState } from "react";
import "./App.css";
import SingleCard from "./components/SingleCard";
import confetti from "canvas-confetti";

const cardImages = [
  { src: "./img/potion-1.png", matched: true },
  { src: "./img/helmet-1.png", matched: true },
  { src: "./img/ring-1.png", matched: true },
  { src: "./img/scroll-1.png", matched: true },
  { src: "./img/shield-1.png", matched: false },
  { src: "./img/sword-1.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [HighScore, setHighScore] = useState(1000);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [win, setWin] = useState(false);

  //shuffleCards

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(0);
    setWin(false);
  };

  //Set HighScore

  useEffect(() => {
    console.log("hola");

    if (HighScore > turns && turns > 0) {
      console.log(turns);
      setHighScore(turns);
    }
  }, [win]);

  //Check for a win

  useEffect(() => {
    if (!cards.some((card) => !card.matched) && cards.some((card) => card)) {
      setWin(true);

      //This code just throws conffeti when there is a winner
      var end = Date.now() + 2 * 1000;
      var colors = ["#bb0000", "#ffffff"];

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [cards]);

  //handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  //compare selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => {
          resetTurn();
        }, 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  //Start a new game automatically

  useEffect(() => shuffleCards(), []);

  return (
    <div className="App">
      <h1>Memory Game</h1>
      <button onClick={shuffleCards}>New Game</button>
      {win ? (
        <div className="win">
          <h1>WINNER</h1>
        </div>
      ) : (
        ""
      )}
      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            handleChoice={handleChoice}
            key={card.id}
            card={card}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          ></SingleCard>
        ))}
      </div>
      <div className="info">
        <h2>Turns: {turns}</h2>
        <h2>HighScore: {HighScore == 1000 ? "0" : HighScore} </h2>
      </div>
    </div>
  );
}

export default App;

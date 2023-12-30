import { useEffect, useState } from "react";
import "./App.css";
import SingleCard from "./components/SingleCard";
import confetti from "canvas-confetti";
import shuffleMp3 from "../public/audio/shuffle.mp3";
import matchMp3 from "../public/audio/match.mp3";
import successMp3 from "../public/audio/success.mp3";

const cardImages = [
  { src: "./img/cookie.png", matched: false },
  { src: "./img/gingerbread.png", matched: false },
  { src: "./img/glove.png", matched: false },
  { src: "./img/present.png", matched: false },
  { src: "./img/xmas-star.png", matched: false },
  { src: "./img/xmas-tree.png", matched: false },
  { src: "./img/sock.png", matched: false },
  { src: "./img/cane.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [HighScore, setHighScore] = useState(1000);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [win, setWin] = useState(false);
  const [showDifficultyMenu, setShowDifficultyMenu] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");

  //shuffleCards
  const shuffleCards = () => {
    const shuffleSound = new Audio(shuffleMp3);
    shuffleSound.play();
    let cardsToDisplay;
    console.log(difficulty);
    switch (difficulty) {
      case "easy":
        cardsToDisplay = cardImages.slice(0, 4);
        break;
      case "medium":
        cardsToDisplay = cardImages.slice(0, 6);
        break;
      case "hard":
        cardsToDisplay = cardImages;
        break;
    }
    const shuffledCards = [...cardsToDisplay, ...cardsToDisplay]
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

    if (HighScore < score && turns > 0) {
      setHighScore(score);
    }
  }, [win]);

  //Check for a win

  useEffect(() => {
    if (!cards.some((card) => !card.matched) && cards.some((card) => card)) {
      setWin(true);
      const successSound = new Audio(successMp3);
      successSound.play();

      //This code just throws conffeti when there is a winner
      var end = Date.now() + 2 * 1000;
      var colors = ["#DA3F3D", "#057C17", "#fff"];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
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
              const matchSound = new Audio(matchMp3);
              matchSound.play();
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

  const handleDifficultyClick = () => {
    setShowDifficultyMenu(!showDifficultyMenu);
  };

  const handleDifficultyChange = (difficulty) => {
    setDifficulty(difficulty);
    handleDifficultyClick();
  };

  //Change game difficulty
  useEffect(() => shuffleCards(), [difficulty]);

  const displayDifficultyMenu = () => {
    if (showDifficultyMenu) {
      return (
        <div className="options container">
          <button
            className={difficulty == "easy" ? "selected" : ""}
            onClick={() => handleDifficultyChange("easy")}
          >
            Easy
          </button>
          <button
            className={difficulty == "medium" ? "selected" : ""}
            onClick={() => handleDifficultyChange("medium")}
          >
            Medium
          </button>
          <button
            className={difficulty == "hard" ? "selected" : ""}
            onClick={() => handleDifficultyChange("hard")}
          >
            Hard
          </button>
        </div>
      );
    }
  };

  let score = 100 - turns * 3;

  return (
    <div className="App">
      <h1>Memory Game</h1>
      <div className="container">
        <button onClick={shuffleCards}>New Game</button>
        <button
          className={showDifficultyMenu ? "selected" : ""}
          onClick={handleDifficultyClick}
        >
          Difficulty
        </button>
      </div>

      {displayDifficultyMenu()}

      {win ? (
        <div className="win">
          <h1>WINNER</h1>
          <h2>Score: {score}</h2>
          <button onClick={shuffleCards}>New Game</button>
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
        <h2>Score: {score}</h2>
        <h2>HighScore: {HighScore == 1000 ? "0" : HighScore} </h2>
      </div>
    </div>
  );
}

export default App;

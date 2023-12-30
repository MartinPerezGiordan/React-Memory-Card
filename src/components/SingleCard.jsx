import "./SingleCard.css";
import flipMp3 from "../../public/audio/flipcard.mp3";
import { useState, useEffect } from "react";

export default function SingleCard({ card, handleChoice, flipped, disabled }) {
  const [playFlipSound, setPlayFlipSound] = useState(false);

  useEffect(() => {
    if (playFlipSound) {
      const audio = new Audio(flipMp3);
      audio.play();
      setPlayFlipSound(false);
    }
  }, [playFlipSound]);

  const handleClick = () => {
    if (!disabled) {
      setPlayFlipSound(true);
      handleChoice(card);
    }
  };

  return (
    <div className="card">
      <div className={flipped ? "flipped" : ""}>
        <img src={card.src} className="front" alt="card front" />
        <img
          src="/img/cover1.png"
          onClick={handleClick}
          className="back"
          alt="card back"
        />
      </div>
    </div>
  );
}

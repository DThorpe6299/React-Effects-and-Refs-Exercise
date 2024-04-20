import React, {useState, useEffect, useRef} from "react";
import axios from "axios";

const CardPicker = () => {
    const [deck, setDeck] = useState(null);
    const [drawnCard, setDrawnCard] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const currentDeck = useRef();

    const stopGame = () => {
        alert("Error: no cards remaining!");
    };

    useEffect(() => {
        axios.get("https://deckofcardsapi.com/api/deck/new/").then(res => {
            setDeck(res.data);
            console.log(deck)
        });
    }, []);
    console.log(deck)

    useEffect(() => {
        if (deck) {
            currentDeck.current = deck;
            currentDeck.current.deckId = deck.deck_id;
        }
    }, [deck]);

    const drawCard = async () => {
        if (currentDeck.current && currentDeck.current.deckId) {
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/${currentDeck.current.deckId}/draw/?count=1`);
            const drawnCardData = res.data.cards[0];
            setDrawnCard(drawnCardData);
            currentDeck.current.remaining = res.data.remaining;
            console.log(`Cards remaining= ${currentDeck.current.remaining}`)
            if (currentDeck.current.remaining === 0) {
                setIsButtonVisible(false);
                stopGame();
            }
        }
    };

    useEffect(() => {
        let intervalId;
        if (isDrawing && deck && deck.remaining > 0) {
            intervalId = setInterval(() => {
                drawCard();
            }, 500);
        }
        return () => clearInterval(intervalId);
    }, [isDrawing, deck]);

    const toggleDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
        } else {
            setIsDrawing(true);
        }
    };
    const getRandomRotation = () => {
        return Math.random() * (45 - (-45)) + (-45);
    };

    const buttonLabel = isDrawing ? "Stop drawing" : "Start drawing";

    return (
        <div>
            {deck && (
                <div>
                    {isButtonVisible && (
                        <button onClick={toggleDrawing}>{buttonLabel}</button>
                    )}
                    {drawnCard && (
                        <div key={drawnCard.code} style={{ transform: `rotate(${getRandomRotation()}deg)`,  marginTop: '75px' }}>
                            <img src={drawnCard.image} alt={`Card: ${drawnCard.value} of ${drawnCard.suit}`} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CardPicker;
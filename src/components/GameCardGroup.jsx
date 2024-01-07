import GameCard from './GameCard'
import { useState } from 'react';
const GameCardGroup = ({ cards, className, forMe }) => {
    const [selectedCards, setSelectedCards] = useState([]);
    const onClick = (index) => {
        const indexToRemove = selectedCards.indexOf(index);
        if (indexToRemove !== -1) {
            selectedCards.splice(indexToRemove, 1);
        } else {
            selectedCards.push(index);
        }
        setSelectedCards([...selectedCards]);
        console.log(selectedCards)
    }
    return (
        <div className={`${className} rounded-md overflow-x-hidden w-full bg-slate-300 absolute flex bottom-5 justify-center`}>
            {cards.map((card, index) => {
                const style = {
                    height: "180px",
                    zIndex: index,
                    transform: `translateX(-${(index + 1) * 80}px)`,
                }
                return (
                    <div className='flex justify-center' style={{ transform: `translateX(${cards.length * 80 / 2}px)` }}>
                        <GameCard isSelected={selectedCards.includes(index)} onClick={() => onClick(index)} style={style} z={index} key={index} suit={card.s} number={card.number}></GameCard>
                    </div>
                )
            })}
        </div>
    )
}
export default GameCardGroup;
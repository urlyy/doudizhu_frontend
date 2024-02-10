import GameCard from '../../components/GameCard'

const DizhuCard = ({ data }) => {
    const tmp = [{ suit: "*", number: "*" }]
    const drawCards = (dataa) => {
        return (
            dataa.map((card, index) => {
                const style = {
                    height: "120px",
                    zIndex: index,
                }
                return (
                    <GameCard key={index} enable={false} style={style} suit={card.suit} number={card.number}></GameCard>
                )
            })
        )
    }
    return (
        <div className='absolute left-1/2 -translate-x-1/2 items-center' style={{ visibility: data == undefined || data.length == 0 ? "hidden" : "visible" }}>
            <div className='border border-black pl-1 pr-1 pb-1 rounded-md'>
                <div className='text-center text-2xl' style={{ userSelect: "none" }}>地主牌</div>
                <div className='flex gap-2'>
                    {data == undefined || data.length == 0 ? drawCards(tmp) : drawCards(data)}
                </div>
            </div>
        </div>
    )
}

export default DizhuCard;
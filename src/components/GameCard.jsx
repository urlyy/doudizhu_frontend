// suit和number是花色和数字
// suit:{suit:"♥",color:"black"}
const Card = ({ style = {}, suit, number, enable, onClick = () => { }, isSelected = false }) => {

    const getColor = (suit) => {
        if (suit == "♠") return 'black';
        if (suit == "♣") return 'black';
        if (suit == "♦") return "red";
        if (suit == "♥") return "red";
    }
    const cardMsg = (suit, number) => {
        if (number == 10) {
            return (
                <div style={{ writingMode: "vertical-lr", display: "flex" }}>
                    <div style={{ writingMode: "horizontal-tb" }}>{number}</div>
                    <div style={{ writingMode: "vertical-lr" }}>{suit}</div>
                </div>

            )
        } else if (number == 'X') {
            return (<span style={{ writingMode: "vertical-lr", padding: "5px" }}>小王</span>)
        } else if (number == 'D') {
            return (<span style={{ writingMode: "vertical-lr", padding: "5px" }}>大王</span>)
        } else {
            return (<span style={{ writingMode: "vertical-lr", }}>{number}{suit}</span>)
        }
    }
    return (
        <div className={`relative ${enable ? "" : "pointer-events-none"}`}
            style={{ ...style, color: getColor(suit), aspectRatio: "5/7", textOrientation: "upright", userSelect: "none" }}
        >
            <div style={{ aspectRatio: "5/7" }} onClick={onClick} className={`h-full ${isSelected ? "-translate-y-10" : "-translate-y-0"} absolute  items-center border  border-gray-400 ${parseInt(style.height.slice(0, -2)) <= 120 ? "text-md" : "text-2xl"} rounded-lg shadow-2xl bg-white cursor-pointer hover:bg-slate-200}`}>
                <div className="flex flex-col w-full hover:bg-slate-300 h-full">
                    <div className="flex-1">
                        {cardMsg(suit, number)}
                    </div>
                    <div className="flex-1 self-center justify-center items-center">
                        {suit}
                    </div>
                    <div className="flex-1 self-end transform rotate-180">
                        {cardMsg(suit, number)}
                    </div>
                </div>
            </div>

        </div >
    )
}
export default Card;
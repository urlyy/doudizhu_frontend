// suit和number是花色和数字
// suit:{suit:"♥",color:"black"}
const Card = ({ isMobile = false, style = {}, className = "", suit, number, enable, onClick = () => { }, isSelected = false }) => {

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
    const computeTextSize = () => {
        if (!isMobile) {
            return parseInt(style.height.slice(0, -2)) <= 120 ? "text-md" : "text-2xl"
        } else {
            return "text-xs"
        }
    }
    return (
        <div className={`${className} relative ${enable ? "" : "pointer-events-none"}`}
            style={{ ...style, color: getColor(suit), aspectRatio: "5/7", textOrientation: "upright", userSelect: "none" }}
        >
            <div style={{ aspectRatio: "5/7" }} onClick={onClick} className={`h-full ${isSelected ? "sm:-translate-y-2 lg:-translate-y-10" : "sm:-translate-y-0 lg:-translate-y-0 "} bg-transparent absolute  items-center ${computeTextSize()} shadow-2xl cursor-pointer}`}>
                <div className={`rounded-lg  flex flex-col w-full  hover:bg-slate-200 ${isSelected ? "bg-slate-300" : "bg-white"} h-full relative border  border-gray-400 `}>
                    <div className="absolute">
                        {cardMsg(suit, number)}
                    </div>
                    <div className="justify-center items-center absolute flex w-full h-full">
                        {suit}
                    </div>
                    <div className="absolute bottom-0 right-0 transform rotate-180">
                        {cardMsg(suit, number)}
                    </div>
                </div>
            </div>

        </div >
    )
}
export default Card;
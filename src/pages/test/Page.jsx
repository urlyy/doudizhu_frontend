export default () => {
    return (
        <div className="h-screen bg-white">
            <div className="flex justify-center">1234</div>
            <div className="w-full bg-slate-300 absolute flex bottom-5">
                <div className="mx-auto bg-yellow-300 flex" style={{ transform: "translateX(20px)" }}>
                    <div className="bg-red-400 border border-blue-500 h-36 w-24 ">1234</div>
                    <div style={{ transform: "translateX(-40px)" }} className="bg-green-400 border border-blue-500 h-36 w-24">1234</div>
                    <div style={{ transform: "translateX(-60px)" }} className="bg-green-400 border border-blue-500 h-36 w-24">1234</div>
                    <div style={{ transform: "translateX(-80px)" }} className="bg-green-400 border border-blue-500 h-36 w-24">1234</div>
                </div>
            </div>
        </div>
    )
}
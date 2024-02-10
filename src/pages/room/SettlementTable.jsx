const SettlementTable = ({ data, isAI }) => {
    const itemClassName = "py-2 px-4 border-b"
    if (data.players != undefined) {
        if (isAI) {
            console.log(data);
            const player = data.players[0];
            return <div className="flex justify-center items-center text-2xl">
                {player.is_dizhu == true ? "地主" : "农民"}{player.is_winner == true ? '获胜' : '失败'}
            </div>
        }
        return (
            <>
                <div className="text-center text-3xl font-bold">{data.winner == 'dizhu' ? '地主获胜' : '农民获胜'}</div>
                <table className='min-w-full bg-white border border-gray-300'>
                    <thead>
                        <tr>
                            <th className={itemClassName}>用户</th>
                            <th className={itemClassName}>状态</th>
                            <th className={itemClassName}>金币</th>
                            <th className={itemClassName}>排名分</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.players != undefined && data.players.map((d, idx) => (
                            <tr key={idx}>
                                <td className={itemClassName}>{d.username}{d.is_dizhu ? "(地主)" : ""}</td>
                                <td className={itemClassName}>{d.is_withdraw ? "逃跑" : ""}</td>

                                <td className={itemClassName}>{d.new_coin}({d.coin_diff > 0 ? "+" : ""}{d.coin_diff})</td>
                                <td className={itemClassName}>{d.new_rank}({d.rank_diff > 0 ? "+" : ""}{d.rank_diff})</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </>
        )
    } else {
        return <></>
    }
}

export default SettlementTable;
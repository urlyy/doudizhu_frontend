const score2rank = (score) => {
    const getRank = (score) => {
        let rank = null;
        const r = score / 1000;
        if (0 <= r && r < 1) {
            rank = "黑铁";
        } else if (1 <= r && r < 2) {
            rank = "青铜";
        } else if (2 <= r && r < 3) {
            rank = "白银";
        } else if (3 <= r && r < 4) {
            rank = "黄金";
        } else if (4 <= r && r < 5) {
            rank = "白金";
        } else if (5 <= r && r < 6) {
            rank = "钻石";
        } else if (6 <= r && r < 7) {
            rank = "大师";
        } else {
            rank = "传说";
        }
        return rank;
    }

    const getDetail = (score) => {
        const d = Math.floor((score % 1000) / 100);
        return d + 1;
    }

    return `${getRank(score)}${getDetail(score)}`;
}

export default score2rank;
const str2number = {
    '3': 0, '4': 1, '5': 2, '6': 3, '7': 4, '8': 5, '9': 6, '10': 7, 'J': 8, 'Q': 9, 'K': 10, 'A': 11, '2': 12, 'X': 13, 'D': 14
};

const cardSequence = Object.keys(str2number);


const cardKinds = (cards) => {
    return new Set(cards.map(card => card.number)).size;
}

const sortByCnt = (cards) => {
    const tmp = {}
    cards.forEach(card => {
        tmp[card.number] = (tmp[card.number] || 0) + 1
    });
    // 根据出现频率降序
    const sortedCards = Object.entries(tmp).sort((a, b) => b[1] - a[1]);
    // [['k', 3], ['A', 2]]
    return sortedCards;
}

//包括单双三顺
const is顺子 = (cards, num) => {
    const d = sortByCnt(cards);
    for (let i = 0; i < d.length; i++) {
        const card = d[i];
        if (card[0] == 'X' || card[0] == 'D' || card[0] == '2') {
            return false;
        }
    }
    const sortedCards = d.sort((a, b) => str2number[a[0]] - str2number[b[0]]);
    for (let i = 0; i < sortedCards.length; i++) {
        const card = sortedCards[i];
        if (num != card[1]) {
            return false;
        }
        if (i != 0) {
            if (str2number[card[0]] - str2number[sortedCards[i - 1][0]] != 1) {
                return false;
            }
        }
    }
    return true;
}

const 拆出四 = (cards) => {
    const sortedCards = sortByCnt(cards);
    if (sortedCards[0][1] != 4) {
        return [null, cards]
    } else {
        const four = [];
        const other = []
        for (let i = 0; i < 4; i++) {
            four.push({ number: sortedCards[0][0] })
        }
        for (let i = 1; i < sortedCards.length; i++) {
            other.push({ number: sortedCards[i][0] })
        }
        return [four, other];
    }
}

const 拆出三顺 = (cards) => {
    const sortedCards = sortByCnt(cards);
    if (sortedCards.length == 1) {
        return [null, cards];
    }
    //至少前两个要是3
    if (sortedCards[0][1] != 3 && sortedCards[1][1] != 3) {
        return [null, cards];
    } else {
        const three = [];
        const other = [];
        for (let i = 0; i < sortedCards.length; i++) {
            if (sortedCards[i][1] != 3) {
                for (let j = 0; j < sortedCards[i][1]; j++) {
                    other.push({ number: sortedCards[i][0] })
                }
            } else {
                for (let j = 0; j < 3; j++) {
                    three.push({ number: sortedCards[i][0] })
                }
            }
        }
        if (is顺子(three, 3)) {
            return [three, other];
        } else {
            return [null, cards];
        }
    }
}

const maxNumber = (cards) => {
    let res = -1;
    cards.forEach(card => {
        const tmp = str2number[card.number]
        if (tmp > res) {
            res = tmp;
        }
    });
    return res;
}


class Type {
    name = ""
    isMyType(cards) {
        return true
    }
    biggerThan(a, b) {
        return
    }
}

class 火箭 extends Type {
    name = "火箭"
    isMyType(cards) {
        if (cards.length != 2) {
            return false;
        }
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if (card.number != 'X' && card.number != 'D') {
                return false;
            }
        }
        return true;
    }
    biggerThan(a, b) {
        return true;
    }
}

class 炸弹 extends Type {
    name = "炸弹"
    isMyType(cards) {
        return cards.length == 4 && cardKinds(cards) == 1;
    }
    biggerThan(a, b) {
        return maxNumber(a) > maxNumber(b);
    }
}

class 四带两对 extends Type {
    name = "四带二"
    isMyType(cards) {
        if (cards.length != 8) {
            return false;
        }
        const [four, other] = 拆出四(cards);
        if (four == null) {
            return false;
        }
        if (cardKinds(other) != 2) {
            return false;
        }
        const sortedCards = sortByCnt(other);
        if (sortedCards[0][1] != 2) {
            return false;
        }
        return true;
    }
    biggerThan(a, b) {
        const [foura, othera] = 拆出四(a);
        const [fourb, otherb] = 拆出四(b);
        return maxNumber(foura) > maxNumber(fourb);
    }
}

class 四带两张 extends Type {
    name = "四带二"
    isMyType(cards) {
        if (cards.length != 6) {
            return false;
        }
        const [four, other] = 拆出四(cards);
        if (four == null) {
            return false;
        }
        return true;
    }
    biggerThan(a, b) {
        const [foura, othera] = 拆出四(a);
        const [fourb, otherb] = 拆出四(b);
        return maxNumber(foura) > maxNumber(fourb);
    }
}

class 飞机带多对 extends Type {
    name = "飞机2"
    isMyType(cards) {
        const [three, other] = 拆出三顺(cards);
        if (three == null) {
            return false;
        }
        const cnt = other.length / 3;
        if (other.length != cnt * 2) {
            return false;
        }
        const sortedCards = sortByCnt(other);
        for (let i = 0; i < sortedCards.length; i++) {
            if (sortedCards[i][1] != 2) {
                return false;
            }
        }
        return true;
    }
    biggerThan(a, b) {
        const [threea, othera] = 拆出三顺(a);
        const [threeb, otherb] = 拆出三顺(b);
        return maxNumber(threea) > maxNumber(threeb)
    }
}

class 飞机带多单 extends Type {
    name = "飞机1"
    isMyType(cards) {
        const [three, other] = 拆出三顺(cards);
        if (three == null) {
            return false;
        }
        const cnt = other.length / 3;
        return other.length == cnt;
    }
    biggerThan(a, b) {
        const [threea, othera] = 拆出三顺(a);
        const [threeb, otherb] = 拆出三顺(b);
        return maxNumber(threea) > maxNumber(threeb)
    }
}

class 三顺 extends Type {
    name = "顺子3"
    isMyType(cards) {
        if (cardKinds(cards) < 2) {
            return false;
        }
        return is顺子(cards, 3);
    }
    biggerThan(a, b) {
        return maxNumber(a) > maxNumber(b)
    }
}

class 对顺 extends Type {
    name = "顺子2"
    isMyType(cards) {
        if (cardKinds(cards) < 3) {
            return false;
        }
        return is顺子(cards, 2);
    }
    biggerThan(a, b) {
        return maxNumber(a) > maxNumber(b)
    }
}

class 单顺 extends Type {
    name = "顺子1"
    isMyType(cards) {
        if (cardKinds(cards) < 5) {
            return false;
        }
        return is顺子(cards, 1);
    }
    biggerThan(cardsa, cardsb) {
        return maxNumber(cardsa) > maxNumber(cardsb);
    }
}



class 三带一对 extends Type {
    name = "三带一对"
    isMyType(cards) {
        if (cards.length != 5 || cardKinds(cards) != 2) {
            return false;
        }
        const sortedCards = sortByCnt(cards);
        return sortedCards[0][1] == 3
    }
    biggerThan(a, b) {
        const sortedCardsA = sortByCnt(a);
        const sortedCardsB = sortByCnt(b);
        return str2number[sortedCardsA[0][0]] > str2number[sortedCardsB[0][0]]
    }
}

class 三带一张 extends Type {
    name = "三带一张"
    isMyType(cards) {
        if (cards.length != 4 || cardKinds(cards) != 2) {
            return false;
        }
        const sortedCards = sortByCnt(cards);
        return sortedCards[0][1] == 3
    }
    biggerThan(a, b) {
        const sortedCardsA = sortByCnt(a);
        const sortedCardsB = sortByCnt(b);
        return str2number[sortedCardsA[0][0]] > str2number[sortedCardsB[0][0]]
    }
}

class 三张 extends Type {
    name = "三个"
    isMyType(cards) {
        return cards.length == 3 && cardKinds(cards) == 1;
    }
    biggerThan(a, b) {
        return str2number[a[0].number] > str2number[b[0].number]
    }
}

class 一对 extends Type {
    name = "一对"
    isMyType(cards) {
        return cards.length == 2 && cardKinds(cards) == 1;
    }
    biggerThan(a, b) {
        return str2number[a[0].number] > str2number[b[0].number]
    }
}

class 一张 extends Type {
    name = "一个"
    isMyType(cards) {
        return cards.length == 1;
    }
    biggerThan(cardsA, cardsB) {
        return str2number[cardsA[0].number] > str2number[cardsB[0].number];
    }
}

const 一张type = new 一张();
const 一对type = new 一对();
const 三张type = new 三张();
const 三带一张type = new 三带一张();
const 三带一对type = new 三带一对();
const 单顺type = new 单顺();
const 对顺type = new 对顺();
const 三顺type = new 三顺();
const 飞机带多单type = new 飞机带多单();
const 飞机带多对type = new 飞机带多对();
const 四带两张type = new 四带两张();
const 四带两对type = new 四带两对();
const 炸弹type = new 炸弹();
const 火箭type = new 火箭();


const types = [
    一张type,
    一对type,
    三张type,
    三带一张type,
    三带一对type,
    单顺type,
    对顺type,
    三顺type,
    飞机带多单type,
    飞机带多对type,
    四带两张type,
    四带两对type,
    炸弹type,
    火箭type,
]

const getType = (cards) => {
    for (const t of types) {
        if (t.isMyType(cards)) {
            return t;
        }
    }
    return null;
    // return 火箭type
}

const isBiggerThan = (cardsA, cardsB) => {
    const typeA = getType(cardsA);
    const typeB = getType(cardsB);
    if (typeA == typeB) {
        return typeA.biggerThan(cardsA, cardsB);
    } else {
        //只需特判火箭和炸弹
        if (typeA == 火箭type) {
            return true;
        }
        if (typeB == 火箭type) {
            return false;
        }
        if (typeA == 炸弹type) {
            return true;
        }
        if (typeB == 炸弹type) {
            return false;
        }
    }
}

const findBiggerCards = (cardsA, cardsB) => {
    const typeB = getType(cardsB);
    for (let i = cardsA.length - 1; i >= 0; i--) {
        for (let j = cardsA.length - 1; j >= i; j--) {
            //左闭右开
            const subCards = cardsA.slice(i, j + 1);
            const typeSubA = getType(subCards);
            if (typeSubA != null && typeSubA == typeB) {
                if (isBiggerThan(subCards, cardsB)) {
                    return [i, j]
                }
            }
        }
    }
    return null;
}


const generateCards = (data) => {
    return data.map(item => {
        return { number: item }
    })
}

const cards = generateCards(['X', 'D'])
const cards1 = generateCards(['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2']);
const cards11 = generateCards(['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']);
const cards2 = generateCards(['3', '3', '4', '4', '5', '5', '6', '6']);
const cards3 = generateCards(['7', '7', '7', '8', '8', '8']);
const cards31 = generateCards(['8', '8', '8', '9', '9', '9']);
const cards32 = generateCards(['7', '7', '7', '8', '8']);
const cards4 = generateCards(['J', 'J', 'J', 'J', 'Q', 'Q']);
const cards5 = generateCards(['X', 'D', '2']);
const cards6 = generateCards(['2', '2', '2', 'Q', 'Q']);

const cards7 = generateCards(['3', '4', '5', '6', '7']);


// const res = findBiggerCards(cards31, cards32);
// console.log(res);
// console.log(getType(cards32))
const cardHelper = {
    isBiggerThan: isBiggerThan,
    getType: getType,
    findBiggerCards: findBiggerCards
}

export default cardHelper

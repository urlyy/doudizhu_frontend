// 核心算法 利用 连对 飞机 顺子 去重后的数组保持连续的特点 即 ....(n - 2) + (n - 1) + n 
let findAndCheck = {
    noRepeat: function (arr) {
        let newArr = [];
        for (i = 0; i < arr.length; i++) {
            if (newArr.indexOf(arr[i]) == -1) {
                newArr.push(arr[i]);
            }
        }
        return newArr;
    },
    compare: function (arr, len) { //用于判断连对 飞机 顺子 的 连续的数
        let baseNum = arr[0];
        let n = 0;
        let newArr = [];
        let arr2 = [];
        arr.forEach(val => {
            if (baseNum - val == n) {//判断是否属于连续的数
                newArr.push(val);
                n++;
            } else {
                baseNum = val;
                if (newArr.length >= len) { //证明这里有符合条件的牌组
                    arr2.push(newArr);
                }
                newArr = [];
                newArr.push(val);
                n = 1;
            }
        });
        newArr = newArr.concat(...arr2);
        return newArr;
    },
    subArr: function (arr, noRepeatArr, len) { //原数组 去重的数组 截取长度个数
        let arr2 = [...arr];  //防止改变原数组
        let newArr = [];
        let amountArr = [];
        noRepeatArr.forEach((val) => {
            let idx = arr2.indexOf(val);
            let subArr = arr2.splice(idx, len);//拿到符合的项目
            amountArr.push(subArr);//符合条件的项目 方便直接出牌
            newArr = newArr.concat(subArr); //拿到符合的牌组和剩余的牌组 splic(index,length,item) 改变原数组 返回截取部分
        });
        return [newArr, arr2, amountArr];
    }
}

//顺子 p[n] - p[n+1] = 1或者-1  p[0] - p[n] = n

function checkShunZi(paiZu, num) { //顺子情况 5-11  查找时可能 数组中可能存在两条以上的顺子
    paiZu = paiZu.filter((val) => {
        return (val < 14);
    })
    let fitArr = [];
    let unRule = []; //存放剩余的牌
    let isShunzi = false;
    let newArr = comFn(paiZu, fitArr, num);
    fitArr = newArr[0];
    unRule = newArr[1];
    let amountArr = newArr[2];
    if (fitArr.length == paiZu.length && fitArr.length >= 5) {
        isShunzi = true;
    }
    if (num) { return [fitArr, unRule, amountArr] };
    console.log("isShunzi", isShunzi);
    return [isShunzi, 1, fitArr, unRule];
}

function checkLianDui(paiZu, num) { //连对情况 6-20  3 - 12 4-13 查找时可能 数组中可能存在两个以上的连对
    if (paiZu.length > 2) {
        paiZu = paiZu.filter((val) => { //去掉大于14的数
            return (val < 14);
        })
    }
    let fitArr = [];
    let unRule = [];
    let isLianDui = false;
    paiZu.map((val, idx) => {
        if (val == paiZu[idx + 1]) {
            fitArr = fitArr.concat(paiZu.slice(idx, (idx + 1)));
        }
    });
    let newArr = comFn(paiZu, fitArr, num);
    fitArr = newArr[0];
    unRule = newArr[1];
    let amountArr = newArr[2];
    if (fitArr.length == paiZu.length && fitArr.length >= 6 || fitArr.length == 2) { isLianDui = true; };
    if (num) { return [fitArr, unRule, amountArr] };
    return [isLianDui, 2, fitArr, unRule];
}

// 牌组中飞机 或者三个同样的牌 p[0] === p[2]  p[3] === p[5] p[6] === p[8]  p[9] === p[11] p[12] === p[14]
// 得到 p[n] === p[n+2] 如果是飞机 则有 p[n] - p[n+3] = 1 或者 -1

function checkFeiJI(paiZu, num) {  //查找时可能 数组中可能存在两个以上的个飞机
    let fitArr = [];  //存放三个一样的牌组
    //三个 或者飞机
    let isFeiJi = false;
    let p = [...paiZu];
    let unRule = [];//存放不符合规则的元素
    p.map((val, idx) => {
        if (p[idx] == p[idx + 2]) {
            fitArr = fitArr.concat(p.slice(idx, idx + 3));
        }
    });
    let newArr = comFn(paiZu, fitArr, num);
    fitArr = newArr[0];
    unRule = newArr[1];
    let amountArr = newArr[2];
    if (fitArr.length > 0 && fitArr.length < p.length) {//证明飞机有带 带单张 或者 对子 
        let duiZiNum = 0;//对子的个数
        let daiNum = fitArr.length / 3; //要带牌的个数
        if (daiNum == unRule.length) {
            console.log("它是飞机带了个" + daiNum + "个", fitArr.join("") + unRule.join(""));
            isFeiJi = true;
        } else if (daiNum == (unRule.length / 2)) {
            //判断带的牌是否为对子
            let n = 0;
            let m = 1;
            unRule.map((val, idx) => {
                //12 34 56相等
                if (unRule[idx + n] && unRule[idx + n] == unRule[idx + m]) {
                    duiZiNum++;
                    n++;
                    m++;
                }
            })
            if (duiZiNum == daiNum) {
                console.log(`它是飞机带了` + duiZiNum + "对", fitArr.join("") + unRule.join(""));
                isFeiJi = true;
            }
        } else if ((unRule.length + 3) == (daiNum - 1)) {
            unRule = unRule.concat(fitArr.splice(-3, 4));
            console.log("它是飞机带了", fitArr.join("") + unRule.join(""));
            isFeiJi = true;
        }
    } else if (fitArr.length == p.length) {
        console.log(`它是飞机没带`, fitArr.join("") + unRule.join(""));
        isFeiJi = true;
    } else {
        console.log("不是飞机");
    }
    if (num) { return [fitArr, unRule, amountArr] };
    return [isFeiJi, 3, fitArr, unRule];
}

//炸弹 或者 四带二 四带两对 王炸
//得到 p[n] === p[n+3]

function checkZhaDan(paiZu, num) { //个数 大于3 小于9
    let p = [...paiZu];
    let fitArr = [];
    let unRule = [];
    let wangZha = [];
    let isZhaDan = false;
    p.map((val, idx) => {
        if (val > 15 && p[idx + 1] > 15) {
            wangZha = [val, p[idx + 1]];
            console.log("王炸");
        }
        if (val == p[idx + 3]) { //找到符合条件的元素
            fitArr = fitArr.concat(p.slice(idx, (idx + 4)));
        }
    });
    let newArr = comFn(paiZu, fitArr, num);
    fitArr = newArr[0];
    unRule = newArr[1];
    let amountArr = newArr[2];
    if (wangZha.length) { //王炸单独处理
        fitArr = wangZha.concat(fitArr);
        amountArr.push(wangZha);
        unRule.splice(0, 2);
    }
    console.log("找炸弹", fitArr);
    if (num) {
        return [fitArr, unRule, amountArr];
    }
    //判断出牌类型
    if (fitArr.length == 4 || fitArr.length == 2) {
        if (fitArr.length == 2) {
            console.log("它是王炸", p.join(""));
            isZhaDan = true;
        } else if (fitArr.length == 4 && unRule.length == 0) {
            console.log("它是炸弹", fitArr.join(""));
            isZhaDan = true;
        } else if (unRule.length == 2) {
            console.log("它是四带二", p.join(""));
            isZhaDan = true;
        } else if (unRule[0] == unRule[1] && unRule[2] == unRule[3]) {//判断对子情况
            console.log("它是四带两对", p.join(""));
            isZhaDan = true;
        }
    } else if (fitArr.length == 8) { //带炸弹
        console.log("它是四带两对", p.join(""))
        isZhaDan = true;
    } else {
        console.log("不是炸弹的其他牌型", unRule.join(""));
    }
    return [isZhaDan, 4, fitArr, unRule];
}


//提取公共方法 让代码个更优雅
function comFn(paiZu, arr, num) {
    let newArr = findAndCheck.noRepeat(arr);//去重 
    newArr = findAndCheck.compare(newArr, num);//比较 拿到合适的牌组
    newArr = findAndCheck.subArr(paiZu, newArr, 4);//重新组成原来的牌
    return newArr;
}

let rules = [checkZhaDan, checkFeiJI, checkLianDui, checkShunZi]; //将牌的规则放入数组，当选完牌后循环验证
function checkPai(paiZu, isOk) {
    // if(!isOk){return}; //用于判断是否到你出牌了
    let result = [];
    if (paiZu.length == 1) { return [true, [paiZu[0]], []]; };//单张
    let res = rules.some((val, idx) => {
        result = val(paiZu);
        return result[0];
    });
    // return result;
    if (res) {

    } else {
        console.log("不符合出牌规则");
    }
    console.log("res", res);
}

//查找比上家大的牌组
function findPai(nowPaiZu, lastPaiZu) { //nowPaiZu:本家牌组 lastPaiZu:上一家出的牌型
    //判断上家出的什么牌 也可以直接通过服务器返回相关信息
    let paiType = checkPai(lastPaiZu); //找到它的要比较的最大值 使用checkPai方法验证上家出的时什么牌型返回[boolean,number,符合的数组,带的数组]
    console.log("上家的牌型", paiType);
    let len = paiType[2].length;
    let max = paiType[2][0];
    let fitArr = nowPaiZu.filter((val) => {
        return (val > max)
    });
    let res = [];
    if (paiType[1] !== 4 && fitArr.length < paiType[2].length) {
        res = checkZhaDan(nowPaiZu, 1);
        return;
    }
    switch (paiType[1]) { //找对子 1 找连对 3 找飞机 2 找炸弹 1 找顺子 5
        case 1: {
            res = checkShunZi(fitArr, 5);
            break;
        }; //找没有重复的牌
        case 2: {
            let n = 1;
            if (len > 2) { n = 3 };
            res = checkLianDui(fitArr, 3);
            break;
        };
        case 3: {
            res = checkFeiJI(fitArr, 2);
            break;
        };
        case 4: {
            res = checkZhaDan(fitArr, 1);
            break;
        };
        default: {
            res = checkDanZhang(fitArr);
        }
    }
    let isTrue = res[0].length - len;
    if (isTrue >= 0) {
        console.log("有可以打的牌", res[0].join(""));
        if (paiType[3].length > 0 && paiType[1] > 3) {//证明上一家出的牌有带
            let surplusArr = nowPaiZu.filter((val) => {
                return (val <= max);
            });
            if ((res[0].length + surplusArr.length) < lastPaiZu.length) { return; } //牌组不够长
            let daiNum = 0; //要带牌的个数
            let len = paiType[3].length;
            if (paiType[1] == 3) { //飞机  如果单张或对子不够的处理没做 
                daiNum = paiType[2].length / 3; //要带牌的个数
                if (daiNum !== len) { //对子
                    let duiArr = checkLianDui(surplusArr, 1);
                } else {//单张
                    let danArr = checkDanZhang(surplusArr);
                }
            } else {//炸弹
                if (paiType[2].length == len) { //四带两对
                    let duiArr = checkLianDui(surplusArr, 1);
                } else {
                    let danArr = checkDanZhang(surplusArr);
                }
            }
            //带单张
            let res = checkDanZhang(surplusArr);
            //带对子
            let duiziNum = 0;
        }
    }

    if (isTrue < 0 && paiType[1] !== 4) {
        res = checkZhaDan(nowPaiZu, 1);
        console.log("有炸弹", res[0].join(""));
    } else {
        // console.log("没牌打了")
    }
}

let lastPai = [4, 4, 4, 4];
let nowPai = [17, 16, 11, 11, 11, 11, 10, 10, 10, 10, 7, 7, 7, 7, 5, 4, 4, 4, 4, 3];
findPai(nowPai, lastPai);
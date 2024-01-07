import { create } from 'zustand'

const userStr = localStorage.getItem("user");
let user = null;
if (userStr) {
    user = JSON.parse(userStr);
}
const userStore = create(set => ({
    token: user ? user.token : null,
    id: user ? user.id : null,
    username: user ? user.username : null,
    coin: user ? user.coin : null,
    rank: user ? user.rank : null,
    cardBack: user ? user.username : null,
    tablecloth: user ? user.username : null,
    // logout: () => set(state => ({
    //     token: null
    // })),
    setUser: (user) => set(state => ({
        id: user.id,
        coin: user.coin,
        username: user.username,
        rank: user.rank,
        tablecloth: user.tablecloth,
        cardBack: user.cardBack,
        token: user.token,
    }))
}))

export default userStore;
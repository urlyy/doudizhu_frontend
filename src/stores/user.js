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
    avatar: user ? user.avatar : null,
    logout: () => set(state => ({
        id: null,
        coin: null,
        username: null,
        rank: null,
        tablecloth: null,
        cardBack: null,
        token: null,
        avatar: null,
    })),
    setUser: (user) => set(state => ({
        id: user.id,
        coin: user.coin,
        username: user.username,
        rank: user.rank,
        tablecloth: user.tablecloth,
        cardBack: user.cardBack,
        token: user.token,
        avatar: user.avatar,
    })),
    setAvatar: (avatar) => set(state => ({
        ...state,
        avatar: avatar,
    }))
}))

export default userStore;
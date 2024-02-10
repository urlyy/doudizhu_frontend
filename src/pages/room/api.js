import request from "../../utils/request";

const api = {
    getUserProfile: async (userID) => {
        const resp = await request.get(`/user/${userID}`)
        return resp.data.data;
    },
    getRoomData: async (roomID) => {
        const resp = await request.get(`/room/${roomID}`);
        return resp.data.data.room_data;
    },

}

export default api;
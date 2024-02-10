import request from "../../utils/request";

const api = {
    getRecords: async (userId) => {
        const res = await request.get(`/user/${userId}/records`)
        return res.data.data;
    },
    getProfile: async (userId) => {
        const resp = await request.get(`/user/${userId}`);
        return resp.data.data;
    },
}

export default api;
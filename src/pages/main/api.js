import request from '../../utils/request'


const api = {
    searchRoom: async (params) => {
        const resp = await request.get("/room/play", params);
        return resp.data;
    },
    createAIRoom: async (params) => {
        const resp = await request.get("/room/play/ai", params)
        return resp.data;
    }
}

export default api;
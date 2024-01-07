import request from '../../utils/request'


const api = {
    searchRoom: async (params) => {
        const resp = await request.get("/room/play", params);
        return resp.data;
    },
    createAIRoom: async () => {
        const resp = await request.postParam("/room/play")
        return resp.data;
    }
}

export default api;
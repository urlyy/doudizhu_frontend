import request from '../../utils/request'

const api = {
    searchRoom: async (params) => {
        const resp = await request.get("/room/play/human", params);
        return resp.data;
    },
    createAIRoom: async (params) => {
        const resp = await request.get("/room/play/ai", params)
        return resp.data;
    },
    searchRoomById: async (roomId, params) => {
        const resp = await request.get(`/room/play/human/${roomId}`, params);
        return resp.data;
    },
    getProfile: async (userId) => {
        const resp = await request.get(`/user/${userId}`);
        return resp.data.data;
    },
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const resp = await request.postForm("/file", formData);
        return resp.data;
    },
    updateAvatar: async (avatar) => {
        console.log(avatar);
        const resp = await request.postParam(`/user/avatar`, { avatar: avatar });
        return resp.data;
    },
}

export default api;
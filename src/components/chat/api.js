import request from "../../utils/request";

const api = {
    getChatMsgs: async () => {
        const res = await request.get("/chat/msgs")
        return res.data.data;
    }
}

export default api;
import request from "../../utils/request";

const api = {
    login: async (username, password) => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password)
        const resp = await request.postForm("/user/login", formData)
        return resp.data.data;
    },
    register: async (username, password) => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password)
        const resp = await request.postForm("/user/register", formData)
        return resp.data;
    }
}


export default api
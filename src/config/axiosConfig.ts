import axios from "axios"

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Удаляем токен и перенаправляем на страницу входа
            localStorage.removeItem("authToken");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axios;

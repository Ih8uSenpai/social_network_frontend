import axios from "axios"

// Настройка глобального перехватчика
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

// Экспортируем настроенный экземпляр Axios
export default axios;

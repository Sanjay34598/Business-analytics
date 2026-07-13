import api from "./api";

export const getSales = async () => {

    const response = await api.get("/sales");

    return response.data;

};
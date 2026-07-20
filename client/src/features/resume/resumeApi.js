import api from "../../shared/api";

export async function createResume() {

    const { data } = await api.post("/resume");

    return data;

}
import api from "../../shared/api/http";

export async function createResume() {

    const { data } = await api.post("/resume");

    return data;

}
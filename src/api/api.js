import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import try_catch from "./try_catch";



const heart_disease_risk = async (data) => {
    return await try_catch(async () => {
        const response = await axios.post(`${API_URL}/heart_disease/predict`, data);
        
        return response;
    });
};

export { heart_disease_risk };

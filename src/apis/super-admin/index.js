import axios from "axios";
import { baseUrl, USER_ACCESS_TOKEN_KEY } from "../../utils/constants";

class SuperAdminAPIs {

    registerNewUser = async (accDetails) => {

        const userAccessToken = localStorage.getItem(USER_ACCESS_TOKEN_KEY) ?? '';

        const response = await axios.post(
            `${baseUrl}/super-admin/register-normal-user`,
            accDetails,
            {
                'headers' : {
                    'Authorization' : `Bearer ${userAccessToken}`
                }
            }
        );
    
        return response.data.data;

    }

    registerNewAdmin = async (accDetails) => {

        const userAccessToken = localStorage.getItem(USER_ACCESS_TOKEN_KEY) ?? '';

        const response = await axios.post(
            `${baseUrl}/super-admin/register-admin-user`,
            accDetails,
            {
                'headers' : {
                    'Authorization' : `Bearer ${userAccessToken}`
                }
            }
        );
    
        return response.data.data;

    }

    makeCallEnd = async (details) => {
        const userAccessToken = localStorage.getItem(USER_ACCESS_TOKEN_KEY) ?? '';

        const response = await axios.patch(
            `${baseUrl}/calls/make-call-end`,
            details,
            {
                'headers' : {
                    'Authorization' : `Bearer ${userAccessToken}`
                }
            }
        );
    
        return response.data;
    }

}

const superAdminAPIs = new SuperAdminAPIs();

export default superAdminAPIs;
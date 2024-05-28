import axios from "axios";
import { baseUrl, USER_ACCESS_TOKEN_KEY } from "../../utils/constants";


class UserAPIs {

    login = async (accCredentials) => {

        const response = await axios.post(
            `${baseUrl}/users/login`,
            accCredentials
        );
    
        return response;
    
    }

    logout = async () => {

        const userAccessToken = localStorage.getItem(USER_ACCESS_TOKEN_KEY) ?? '';

        const response = await axios.post(
            `${baseUrl}/users/logout`,
            {},
            {
                'headers' : {
                    'Authorization' : `Bearer ${userAccessToken}`
                }
            }
        );
    
        return response;
    
    }

    getCurrentUser = async () => {
        try {

            const userAccessToken = localStorage.getItem(USER_ACCESS_TOKEN_KEY) ?? '';
            
            console.log('ACCESS TOKEN');
            console.log(userAccessToken)

            if(userAccessToken == null || userAccessToken == undefined || userAccessToken === '') {
                throw new Error('ERRORRRINGG.....');
            }

            const response = await axios.get(
                `${baseUrl}/users/current-user`,
                {
                    'headers' : {
                        'Authorization' : `Bearer ${userAccessToken}`
                    }
                }
            );
        
            return response.data.data;
            
        } catch (error) {
            console.log(`GET CURRENT USER: ${error}`);
            throw error;
        }
    }

    updateUserAccDetails = async (accDetails) => {
        
        const userAccessToken = localStorage.getItem(USER_ACCESS_TOKEN_KEY) ?? '';

        const response = await axios.patch(
            `${baseUrl}/users/update-user-account-details`,
            accDetails,
            {
                'headers' : {
                    'Authorization' : `Bearer ${userAccessToken}`
                }
            }
        );
    
        return response.data.data;

    }

    getAdminAccStats = async () => {
        const userAccessToken = localStorage.getItem(USER_ACCESS_TOKEN_KEY) ?? '';

        const response = await axios.get(
            `${baseUrl}/admins/get-admin-dashboard-stats`,
            {
                'headers' : {
                    'Authorization' : `Bearer ${userAccessToken}`
                }
            }
        );
    
        return response.data.data;

    }

    getRecentCalls = async (callStatus, callType, noOfDocsEachPage, currentPageNumber) => {

        const userAccessToken = localStorage.getItem(USER_ACCESS_TOKEN_KEY) ?? '';

        const data = {
            'callStatus' : callStatus,
            'callType' : callType,
            'noOfDocsEachPage' : noOfDocsEachPage,
            'currentPageNumber' : currentPageNumber
        }

        const response = await axios.get(
            `${baseUrl}/admins/get-admin-calls`,
            {
                params: data,
                'headers' : {
                    'Authorization' : `Bearer ${userAccessToken}`
                }
            }
        );
    
        return response.data.data;

    }

    getOTP = async (email) => {

        const response = await axios.post(
            `${baseUrl}/users/send-otp`,
            email,
        );

        return response.data.data;

    }

    resetPassword = async (details) => {

        console.log(details);

        const response = await axios.patch(
            `${baseUrl}/users/change-user-password`,
            details,
        );

        return response.data.data;

    }

    changeCallStatus = async (details) => {

        const userAccessToken = localStorage.getItem(USER_ACCESS_TOKEN_KEY) ?? '';

        const response = await axios.patch(
            `${baseUrl}/calls/change-call-status`,
            details,
            {
                'headers' : {
                    'Authorization' : `Bearer ${userAccessToken}`
                }
            }

        );

        return response.data;

    }

    changeCallType = async (details) => {

        const userAccessToken = localStorage.getItem(USER_ACCESS_TOKEN_KEY) ?? '';

        const response = await axios.patch(
            `${baseUrl}/calls/change-call-type`,
            details,
            {
                'headers' : {
                    'Authorization' : `Bearer ${userAccessToken}`
                }
            }

        );

        return response.data;

    }

    deleteAccount = async (details) => {

        const userAccessToken = localStorage.getItem(USER_ACCESS_TOKEN_KEY) ?? '';

        const response = await axios.delete(
            `${baseUrl}/users/delete-my-account`,
            {
                'headers' : {
                    'Authorization' : `Bearer ${userAccessToken}`
                }
            }

        );

        return response.data;

    }

    
}

const userAPIs = new UserAPIs();

export default userAPIs;
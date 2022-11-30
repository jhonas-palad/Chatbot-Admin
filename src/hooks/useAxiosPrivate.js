import { axiosPrivate } from '../api/axios';
import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import useAuth from './useAuth';

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config) => {
                //Do something before request is sent
                //Attach Token in Authorization header
                if(!config.headers?.Authorization){
                    config.headers.Authorization = `Bearer ${auth?.access_token}`
                }
                return config;
            },
            (err) => Promise.reject(err)
        );
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => {
                return response
            },
            async (err) => {
                const previousConfig = err?.config;
                if(err?.response.status === 403 && !previousConfig?.retry){
                    previousConfig.retry = true;
                    const newAccessToken = await refresh();
                    previousConfig.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosPrivate(previousConfig);
                }
                return Promise.reject(err);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh]);

    return axiosPrivate;
}

export default useAxiosPrivate;
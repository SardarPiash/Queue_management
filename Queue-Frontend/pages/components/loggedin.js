import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function LoggedIn({ handleLoading }) {
    const router = useRouter();

    useEffect(() => {
        try {

            const isLoggedIn = async () => {
                const token = localStorage.getItem('jwtoken');
                const user = localStorage.getItem('user');
    
                if (token && user) {
                    const userrole = JSON.parse(user).role;
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await axios.get('http://127.0.0.1:8000/api/isloggedin');

                    if (response.data.error) {
                        if (response.data.error == "token has expired" || response.data.error == "invalid token") {
                            localStorage.clear();
                        }
                    }
    
                    if (response.data == "valid") {
                        if (userrole == 0) {
                            router.push('/patient/dashboard');
                        } else if (userrole == 1) {
                            router.push('/');
                        } else if (userrole == 2) {
                            router.push('/doctor');
                        } else if (userrole == 3) {
                            router.push('/admin');
                        }
                    }
                    
                }
                Loadingoff();
            };
    
            isLoggedIn();

        } catch (error) {
            console.error(error);
        }
    }, [router]);

    const Loadingoff = () => {
        handleLoading(false);
    };

    return null;
}
//for login and register page
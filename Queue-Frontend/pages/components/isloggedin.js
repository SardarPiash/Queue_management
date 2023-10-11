import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Loading from '../loading';

export default function IsLoggedIn(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            setLoading(true);

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
                            router.push('/login');
                        }
                    }

                    
                    if (userrole !== props.pgrole) {
                        router.back();
                    } else {
                        setLoading(false);
                    }
                    
                } else {
                    router.push('/login');
                }
            };
    
            isLoggedIn();

        } catch (error) {
            console.error(error);
        }
    }, [router]);

    return (
        <>
            {loading && <Loading />}
        </>
    );
}

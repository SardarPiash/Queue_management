import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";
import NavBarV2 from "./themeV2";
import axios from "axios";

function viewProfile(){

    const router = useRouter();

    const [responseData, setResponseData] = useState({
        first_name: "",
        last_name: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
    });

    useEffect(() => {

        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            const pid = user.id;
            console.log(pid);
            const apiUrl = 'http://localhost:8000/api/patient/about/{pid}';

            axios
                .get(apiUrl.replace('{pid}', pid), {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtoken')}`,
                    },
                    withCredentials: true,
                })
                .then((response) => {
                    if (response.data.error) {
                        if (response.data.error == "token has expired" || response.data.error == "invalid token") {
                            localStorage.clear();
                            router.push('/login');
                        }
                    }
                    if (response.data.message == "No user found." || response.data.message == "User is not a Patient.") {
                        //
                    } else {
                        setResponseData(response.data.user);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        } else {
            router.push('/login');
        }
    }, []);


    return(
        <>
        <NavBarV2/>
        {/*<div>*/}
            {/*<h2>viewProfile Profile Page</h2>*/}
        {/*    <pre>{JSON.stringify(responseData, null, 5)}</pre>*/}
        {/*</div>*/}

            <section className="flex justify-center">
                <div className="flex flex-col items-center w-full min-h-screen max-w-[1600px] py-[75px]">
                    <div className="flex justify-center w-full max-h-screen overflow-y-auto px-5 py-9 rounded-md shadow-md">
                        <div className="w-full max-h-full overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-violet-300">
                                <tr className="border-2 border-gray-400 border-l-0 border-t-0 border-r-0">
                                    <th className="text-[14px] font-bold text-left px-3 py-2">Patient Name</th>
                                    <th className="text-[14px] font-bold text-left px-3 py-2">Gender</th>
                                    <th className="text-[14px] font-bold text-left px-3 py-2">Phone</th>
                                    <th className="text-[14px] font-bold text-left px-3 py-2">Email</th>
                                    <th className="text-[14px] font-bold text-left px-3 py-2">Address</th>
                                </tr>
                                </thead>
                                <tbody className="">
                                    {
                                        <tr>
                                            <td className="text-[14px] font-[500] text-left px-3 py-2">{responseData.first_name}&nbsp;{responseData.last_name}</td>
                                            <td className="text-[14px] font-[500] text-left px-3 py-2">{responseData.gender}</td>
                                            <td className="text-[14px] font-[500] text-left px-3 py-2">{responseData.phone}</td>
                                            <td className="text-[14px] font-[500] text-left px-3 py-2">{responseData.email}</td>
                                            <td className="text-[14px] font-[500] text-left px-3 py-2">{responseData.address}</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        
        </>
    );
};
export default viewProfile;
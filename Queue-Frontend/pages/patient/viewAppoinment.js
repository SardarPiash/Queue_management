import React, {useEffect, useState} from "react";
import NavBarV2 from "./themeV2";
import axios from "axios";

function viewAppoinment(){

    const [responseData, setResponseData] = useState([]);
    useEffect(() => {

        const userData = localStorage.getItem('user');
        const user = JSON.parse(userData);
        const pid = user.id;
        const apiUrl = 'http://localhost:8000/api/view/patient/appointment/{pid}';

        axios
            .get(apiUrl.replace('{pid}', pid), {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtoken')}`,
                },
                withCredentials: true,
            })
            .then((response) => {
                console.log('Response Data:', response.data);
                setResponseData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);


    return(
        <>
        <NavBarV2/>
            <div>
                {/*<pre>{JSON.stringify(responseData, null, 5)}</pre>*/}
            </div>

            <section className="flex justify-center">
                <div className="flex flex-col items-center w-full min-h-screen max-w-[1600px] py-[75px]">
                    <div className="flex justify-center w-full max-h-screen overflow-y-auto px-5 py-9 rounded-md shadow-md">
                        <div className="w-full max-h-full overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-violet-300">
                                <tr className="border-2 border-gray-400 border-l-0 border-t-0 border-r-0">
                                    <th className="text-[14px] font-bold text-left px-3 py-2">Patient Name</th>
                                    <th className="text-[14px] font-bold text-left px-3 py-2">Doctor Name</th>
                                    <th className="text-[14px] font-bold text-left px-3 py-2">Hospital Name</th>
                                    <th className="text-[14px] font-bold text-left px-3 py-2">Appointment Date</th>
                                    <th className="text-[14px] font-bold text-left px-3 py-2">Day</th>
                                    <th className="text-[14px] font-bold text-left px-3 py-2">Time</th>
                                </tr>
                                </thead>
                                <tbody className="">
                                {
                                    responseData.length > 0 &&
                                    responseData.map((item) => (
                                        <tr key={item.id}>
                                            <td className="text-[14px] font-[500] text-left px-3 py-2">{item.patient_name}</td>
                                            <td className="text-[14px] font-[500] text-left px-3 py-2">{item.doctor_fname}</td>
                                            <td className="text-[14px] font-[500] text-left px-3 py-2">{item.hospital_name}</td>
                                            <td className="text-[14px] font-[500] text-left px-3 py-2">{item.date_of_appointment}</td>
                                            <td className="text-[14px] font-[500] text-left px-3 py-2">{item.day_of_week}</td>
                                            <td className="text-[14px] font-[500] text-left px-3 py-2">{item.doctor_visiting_time}</td>
                                        </tr>
                                    ))
                                }
                                {
                                    responseData.length === 0 &&
                                    <tr className="">
                                        <td colSpan={7} className="text-[14px] font-[500] text-center px-4 py-2">No Appointment Info Found</td>
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
}
export default viewAppoinment;
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../components/layout';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { CubeIcon } from '@heroicons/react/20/solid';
import IsLoggedIn from '../components/isloggedin';
import Loading from '../loading';


export default function Doctors() {
    const router = useRouter();
    const [doctors, setDoctors] = useState([]);
    const [statusmsg, setStatusmsg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            const fetchDoctors = async () => {
                setLoading(true);
                const user = localStorage.getItem('user');
                const token = localStorage.getItem('jwtoken');

                if (user && token) {
                    const adminid = JSON.parse(user).id;
                    const response = await axios.get(`http://127.0.0.1:8000/api/hospital/about/${adminid}`,
                        {
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            },
                        });

                    if (response.data.error) {
                        if (response.data.error == "no token provided" || response.data.error == "invalid token") {
                            localStorage.clear();
                            router.push('/login');
                        } else if (response.data.error == "token has expired") {
                            localStorage.clear();
                            router.push('/login');
                        }
                    }

                    if (response.data.message && response.data.message == "No hospital found.") {
                        setStatusmsg("You have not registered your hospital yet.");
                        setLoading(false);
                    }
                    else {
                        const res = await axios.get(`http://localhost:8000/api/doctor/hospital/${response.data.id}`,
                            {
                                headers: {
                                    "Authorization": `Bearer ${token}`,
                                },
                            });

                        if (res.data.error) {
                            if (res.data.error == "no token provided" || res.data.error == "invalid token") {
                                localStorage.clear();
                                router.push('/login');
                            } else if (res.data.error == "token has expired") {
                                localStorage.clear();
                                router.push('/login');
                            }
                        }

                        if (response.data.message && response.data.message == "No doctor found.") {
                            setDoctors([]);
                            setLoading(false);
                        } else {
                            setDoctors(res.data);
                            setLoading(false);
                        }
                    }
                }
            };
            fetchDoctors();
        }
        catch (error) {
            console.error(error);
        }
    }, []);

    const handleDelete = async (uid) => {
        try {
            const confirmed = window.confirm("Are you sure you want to delete this admin?");

            if (confirmed) {
                const response = await axios.delete(`http://localhost:8000/api/doctor/delete/${uid}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem('jwtoken')}`,
                        },
                    });
                if (response.data.error) {
                    if (response.data.error == "no token provided" || response.data.error == "invalid token") {
                        localStorage.clear();
                        router.push('/login');
                    } else if (response.data.error == "token has expired") {
                        localStorage.clear();
                        router.push('/login');
                    }
                }

                if (response.data.message == "Doctor deleted successfully") {
                    setDoctors(doctors.filter((doctor) => doctor.user.id !== uid));
                } else {
                    setStatusmsg(response.data.message);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const pgrole = 3;
    return (
        <>
            <IsLoggedIn pgrole={pgrole} />
            {
                loading ?
                    <Loading />
                    :
                    <Layout title="Doctors - Medical Service">
                        <section className="flex justify-center">
                            <div className="flex flex-col items-center w-full min-h-screen max-w-[1600px] py-[75px]">
                                {
                                    statusmsg &&
                                    <div className="flex justify-center items-center px-4 py-2 w-11/12">
                                        <p className="text-[14px] font-[500] text-center text-red-600">{statusmsg}</p>
                                    </div>
                                }
                                <div className="flex justify-center w-full max-h-screen overflow-y-auto px-5 py-9 rounded-md shadow-md">
                                    <div className="w-full max-h-full overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-violet-300">
                                                <tr className="border-2 border-gray-400 border-l-0 border-t-0 border-r-0">
                                                    <th className="text-[14px] font-bold text-center px-3 py-2">#</th>
                                                    <th className="text-[14px] font-bold text-left px-3 py-2">First Name</th>
                                                    <th className="text-[14px] font-bold text-left px-3 py-2">Last Name</th>
                                                    <th className="text-[14px] font-bold text-left px-3 py-2">ID</th>
                                                    <th className="text-[14px] font-bold text-left px-3 py-2">Specialty</th>
                                                    <th colSpan={2} className="text-[14px] font-bold text-center px-3 py-2">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="">
                                                {
                                                    doctors.length > 0 &&
                                                    doctors.map((doctor) => (
                                                        <tr key={doctor.user.id} className="odd:bg-amber-50 even:bg-slate-100 ">
                                                            <td className="text-left px-2 py-2">
                                                                <div className="flex justify-center items-center">
                                                                    <CubeIcon className="h-5 w-5 text-lime-600" />
                                                                </div>
                                                            </td>
                                                            <td className="text-[14px] font-[500] text-left px-3 py-2">{doctor.user.first_name}</td>
                                                            <td className="text-[14px] font-[500] text-left px-3 py-2">{doctor.user.last_name}</td>
                                                            <td className="text-[14px] font-[500] text-left px-3 py-2">{doctor.doctor.id}</td>
                                                            <td className="text-[14px] font-[500] text-left px-3 py-2">{doctor.doctor.specialization}</td>
                                                            <td className="px-3 py-2">
                                                                <button className="flex w-fit h-fit rounded-md justify-center items-center px-4 py-2 text-[14px] font-[500] text-white bg-indigo-600 hover:bg-indigo-800 transition duration-300">
                                                                    Edit
                                                                </button>
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <button onClick={() => handleDelete(doctor.user.id)} className="flex w-fit h-fit rounded-md justify-center items-center px-4 py-2 text-[14px] font-[500] text-white bg-red-600 hover:bg-red-800 transition duration-300">
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                                {
                                                    doctors.length === 0 &&
                                                    <tr className="">
                                                        <td colSpan={7} className="text-[14px] font-[500] text-center px-4 py-2">No Doctor Info Found</td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </Layout>
            }
        </>
    );
}

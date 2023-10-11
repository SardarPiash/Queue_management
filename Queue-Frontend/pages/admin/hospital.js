import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../components/layout';
import IsLoggedIn from '../components/isloggedin';
import Loading from '../loading';

export default function Hospital() {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm();
    const router = useRouter();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [statusmsg, setStatusmsg] = useState("");
    const [iseditable, setIseditable] = useState(false);

    useEffect(() => {
        try {
            const fetchHospital = async () => {
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
                        if (response.data.error == "token has expired" || response.data.error == "invalid token") {
                            localStorage.clear();
                            router.push('/login');
                        }
                    }

                    if (response.data.message && response.data.message == "No hospital found.") {
                        setStatusmsg("You have not registered any hospital yet.");
                        setLoading(false);
                    }
                    else {
                        setValue('hospitalid', response.data.id);
                        setValue('hospitalname', response.data.hospitalname);
                        setValue('hospitallocation', response.data.location);
                        setLoading(false);
                    }
                } else {
                    router.push('/login');
                }
            };
            fetchHospital();
        }
        catch (error) {
            console.error(error);
        }
    }, []);


    const onSubmit = async (data) => {

        try {
            const response = await axios.put('http://127.0.0.1:8000/api/hospital/update',
                {
                    hid: data.hospitalid,
                    hospitalname: data.hospitalname,
                    location: data.hospitallocation,
                    adminid: JSON.parse(localStorage.getItem('user')).id
                }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('jwtoken')}`,
                },
                withCredentials: true
            });

            if (response.data.error){
                if (response.data.error == "no token provided" || response.data.error == "invalid token") {
                    localStorage.clear();
                    router.push('/login');
                } else if (response.data.error == "token has expired") {
                    localStorage.clear();
                    router.push('/login');
                }
            }

            if (response.data.message == "Hospital Update successful") {
                setError("");
                setSuccess("updated successfully");
                setValue('hospitalid', response.data.hospital.id);
                setValue('hospitalname', response.data.hospital.hospitalname);
                setValue('hospitallocation', response.data.hospital.location);
                setIseditable(false);
                setTimeout(() => {
                    setSuccess("");
                }, 3000);
            }
        }
        catch (error) {
            console.error(error);
            setError("something went wrong");
        }
    }


    const handleDelete = async (hid) => {
        try {
            const confirmed = window.confirm("All data associated with this hostpital will be deleted.\nAre you sure?");

            if (confirmed) {
                const response = await axios.delete(`http://127.0.0.1:8000/api/hospital/delete/${hid}`,
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

                if (response.data.message == "Hospital deleted successfully") {
                    setError("");
                    setSuccess("deleted successfully");
                    setValue('hospitalid', "");
                    setValue('hospitalname', "");
                    setValue('hospitallocation', "");
                    setTimeout(() => {
                        setSuccess("");
                    }, 3000);
                }
            }
        } catch (error) {
            console.error(error);
            setError("something went wrong");
        }
    };

    const handleEditable = () => {
        setIseditable(true);
    };


    const pgrole = 3;
    return (
        <>
            <IsLoggedIn pgrole={pgrole} />
            {
                loading ?
                    <Loading />
                    :
                    <Layout title="Hospital - Medical Service">
                        <section className="flex justify-center">
                            <div className="flex flex-col items-center w-full min-h-screen max-w-[1600px] py-[75px]">
                                {
                                    statusmsg &&
                                    <div className="flex justify-center items-center px-4 py-2 w-11/12">
                                        <p className="text-[14px] font-[500] text-center text-red-600">{statusmsg}</p>
                                    </div>
                                }
                                <h4 className="my-[20px] block font-sans text-2xl font-bold leading-snug tracking-normal text-blue-gray-900 antialiased">
                                    Hospital Information
                                </h4>
                                <hr className="w-8/12 border border-y-gray-300 mb-[20px]" />

                                <div className="relative flex items-center justify-center rounded-md bg-white shadow-md p-8 w-80 h-fit">
                                    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                                        <div className="flex flex-col w-full justify-center mb-4">
                                            <label className="font-semibold text-sm text-black">
                                                Hospital ID:
                                            </label>
                                            <input
                                                type="number"
                                                {...register('hospitalid', { required: true })}
                                                className="input-field bg-transparent border border-gray-200 px-2 py-1 rounded-lg font-semibold text-sm text-gray-700 outline outline-transparent focus:border-indigo-400 transition-[outline,_color,_background-color,_border-color,_text-decoration-color] duration-[300ms]"
                                                disabled={true}
                                            />
                                        </div>

                                        <div className="flex flex-col w-full justify-center mb-4">
                                            <label className="font-semibold text-sm text-black">
                                                Hospital Name:
                                            </label>
                                            <input
                                                type="text"
                                                {...register('hospitalname', { required: true })}
                                                className="input-field bg-transparent border border-gray-200 px-2 py-1 rounded-lg font-semibold text-sm text-gray-800 outline outline-transparent focus:border-indigo-400 transition-[outline,_color,_background-color,_border-color,_text-decoration-color] duration-[300ms]"
                                                disabled={!iseditable}
                                            />
                                            {errors.hospitalname && (
                                                <p className="font-semibold text-center text-red-700 text-[12px] leading-4 pb-2">Hospital Name is required</p>
                                            )}
                                        </div>

                                        <div className="flex flex-col w-full justify-center mb-4">
                                            <label className="font-semibold text-sm text-black">
                                                Hospital Location:
                                            </label>
                                            <input
                                                type="text"
                                                {...register('hospitallocation', { required: true })}
                                                className="input-field bg-transparent border border-gray-200 px-2 py-1 rounded-lg font-semibold text-sm text-gray-800 outline outline-transparent focus:border-indigo-400 transition-[outline,_color,_background-color,_border-color,_text-decoration-color] duration-[300ms]"
                                                disabled={!iseditable}
                                            />
                                            {errors.hospitallocation && (
                                                <p className="font-semibold text-center text-red-700 text-[12px] leading-4 pb-2">Hospital Location is required</p>
                                            )}
                                        </div>

                                        {
                                            !statusmsg &&
                                            <div className="flex justify-between items-center mt-7 gap-3" >
                                                {
                                                    !iseditable ?
                                                        <button type="button" onClick={handleEditable} className="text-white bg-indigo-500 hover:bg-indigo-800 transition duration-300 w-fit px-4 py-1 rounded-md">
                                                            Edit
                                                        </button>
                                                        :
                                                        <div className="flex justify-center items-center w-fit h-fit gap-3">
                                                            <button type="submit" className="text-white bg-indigo-500 hover:bg-indigo-800 transition duration-300 w-fit px-3 py-1 rounded-md">
                                                                Update
                                                            </button>
                                                            <button type="button" onClick={() => setIseditable(false)} className="text-white bg-gray-600 hover:bg-gray-800 transition duration-300 w-fit px-3 py-1 rounded-md">
                                                                Cancel
                                                            </button>
                                                        </div>
                                                }
                                                <button type="button" onClick={() => handleDelete(getValues('hospitalid'))} className="text-white bg-red-600 hover:bg-red-800 transition duration-300 w-fit px-3 py-1 rounded-md">
                                                    Delete
                                                </button>
                                            </div>
                                        }
                                        {error && (<p className="text-center font-semibold text-sm text-red-500 my-1">{error}</p>)}
                                        {success && (<p className="text-center font-semibold text-sm text-green-600 my-1">{success}</p>)}


                                    </form>
                                </div>
                            </div>
                        </section>
                    </Layout>
            }
        </>
    );
}

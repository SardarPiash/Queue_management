import React, {useEffect, useState} from "react";
import NavBarV2 from "./themeV2";
import axios from "axios";
import {useRouter} from "next/router";
import {useForm} from "react-hook-form";
import Link from "next/link";

export default function updateProfile() {

    let ufirstname = "";
    let ulastname = "";
    let uphone = "";
    let ugender = "";
    let uemail = "";
    let uaddress = "";
    let uid = "";

    if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    const user = JSON.parse(userData);
    ufirstname = user.first_name;
    ulastname = user.last_name;
    uphone = user.phone
    ugender = user.gender;
    uemail = user.email;
    uaddress = user.address;
    uid = user.id;
    }

    //Update portion
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [addressError, setAddressError] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();
    const {register, handleSubmit, reset} = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        setPhoneError("");
        setAddressError("");
        if (!phone) {
            setPhoneError("Enter Phone Number");
            setLoading(false);
            return;
        } else {
            const phonePattern = /^(01[3456789][0-9]{8})$/;
            if (!phonePattern.test(phone)) {
                setPhoneError("Wrong Input");
                setLoading(false);
                return;
            }
        }
        if (!address) {
            setAddressError("Enter Address");
            setLoading(false);
            return;
        }
        try {
            const response = await axios.put('http://127.0.0.1:8000/api/patient/update',
                {
                    uid: uid,
                    firstName: ufirstname,
                    lastName: ulastname,
                    gender: ugender,
                    phone: data.phone,
                    email: uemail,
                    address: data.address
                }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtoken')}`,
                    "Content-Type": "application/json"
                },
                    withCredentials: true
            });
            console.log(response);
        }
        catch (error) {
            console.error(error);
            setError("Something went wrong");
            setLoading(false);
        }


    }





    return (
        <>
            <NavBarV2/>
            <section className="flex justify-center">
                <div className="flex flex-col justify-center items-center w-full min-h-screen max-w-[1600px] py-[75px]">
                    <h4 className="my-[20px] block font-sans text-2xl font-bold leading-snug tracking-normal text-blue-gray-900 antialiased">
                        Edit Profile
                    </h4>
                    <div className="relative flex items-center justify-center rounded-md bg-white shadow-md p-8 w-80 h-fit">

                        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                            <div className="flex flex-col w-full justify-center mb-4">
                                <label className="font-semibold text-sm text-black">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={ufirstname}
                                    readOnly
                                    className="input-field bg-blue-100 p-1 rounded-lg"
                                    onChange={(e) => setFirstName(e.target.value)}
                                />

                            </div>
                            <div className="flex flex-col w-full justify-center mb-4">
                                <label className="font-semibold text-sm text-black">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={ulastname}
                                    readOnly
                                    className="input-field bg-blue-100 p-1 rounded-lg"
                                    onChange={(e) => setLastName(e.target.value)}
                                />

                            </div>
                            <div className="flex flex-col w-full justify-center mb-4">
                                <label className="font-semibold text-sm text-black">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={phone}
                                    className="input-field bg-blue-100 p-1 rounded-lg"
                                    onChange={(e) => setPhone(e.target.value)}
                                    pattern="^(\+880|0)(1[3-9]\d{8})$"
                                    title="Enter a valid Bangladeshi phone number"
                                />
                                {phoneError && (
                                    <p className="text-center font-semibold text-sm text-red-500">{phoneError}</p>
                                )}
                            </div>
                            <div className="flex flex-col w-full justify-center mb-4">
                                <label className="font-semibold text-sm text-black">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={uemail}
                                    readOnly
                                    className="input-field bg-blue-100 p-1 rounded-lg"
                                    onChange={(e) => setEmail(e.target.value)}
                                    title="Enter a valid email address (e.g., john.doe@example.com)"
                                />
                            </div>

                            <div className="flex flex-col w-full justify-center mb-4">
                                <label className="font-semibold text-sm text-black">
                                    Address
                                </label>
                                <textarea
                                    rows={2}
                                    name="address"
                                    value={address}
                                    className="w-full rounded-lg bg-blue-100 border-2 border-gray-400 focus:border-indigo-600 focus:caret-indigo-500 font-[600] text-[13px] outline-0 py-1 px-3 leading-8 transition duration-300 ease-in-out"
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                {addressError && (
                                    <p className="text-center font-semibold text-sm text-red-500">{addressError}</p>
                                )}
                            </div>

                            <button className="text-white bg-indigo-500 hover:bg-indigo-800 w-full px-4 py-2 rounded-md" type="submit">
                                Update
                            </button>
                            {error && (<p className="text-center font-semibold text-sm text-red-500 my-1">{error}</p>)}
                            {success && (<p className="text-center font-semibold text-sm text-green-600 my-1">{success}</p>)}

                        </form>
                    </div>
                </div>
            </section>

        </>
    );
};

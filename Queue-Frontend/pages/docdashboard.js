import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

export default function DocDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [clickedAppointments, setClickedAppointments] = useState([]);
  const router = useRouter();
  const [sms, setSMS] = useState();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userString);
    const userRole = user.role;

    if (userRole !== 2) {
      router.push("/login");
      return;
    }

    const jwttoken = localStorage.getItem("jwtoken");
    if (!jwttoken) {
      router.push("/login");
      return;
    }
    fetchAllAppointments();
  }, [router]);

  const fetchAllAppointments = async () => {
    try {
      const token = localStorage.getItem("jwtoken");
      const userString = localStorage.getItem("user");
      const user = JSON.parse(userString);
      const did = parseInt(user.id);
      const response = await axios.get(
        `http://127.0.0.1:8000/api/view/appointment/${did}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.error) {
        if (response.data.error == "no token provided" || response.data.error == "invalid token") {
            localStorage.clear();
            router.push('/login');
        } else if (response.data.error == "token has expired") {
            localStorage.clear();
            router.push('/login');
        }
    }
      console.log(response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleNextClick = async (id) => {
    try {
      const token = localStorage.getItem("jwtoken");
      const response = await axios.post(
        `http://127.0.0.1:8000/api/sms/notification/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSMS(response.data.message);
      setClickedAppointments([...clickedAppointments, id]);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-between bg-white p-4 shadow-md">
        <Link href="/docdashboard" className="text-blue-600 hover:underline">
          Dashboard
        </Link>
        <Link href="/updateProfileDoctor" className="text-blue-600 hover:underline">
          Update Profile
        </Link>
        <Link href="/docProfile" className="text-blue-600 hover:underline">
          View Profile
        </Link>
        <Link href="/logout" className="text-blue-600 hover:underline">
          Logout
        </Link>
      </div>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Patient Appointment List</h1>
        <div className="p-4 bg-white shadow-md rounded-md">
        {sms && <p className="text-center mb-4">{sms}</p>}
          {appointments.length > 0 ? (
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Serial</th>
                  <th className="px-4 py-2">Patient Name</th>
                  {/* <th className="px-4 py-2">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={appointment.id}>
                    <td className="px-4 py-2">{++index}</td>
                    <td className="px-4 py-2">{appointment.patient_name}</td>
                    <td className="px-4 py-2">
                      {!clickedAppointments.includes(appointment.patient_id) ? (
                        <button
                          type="button"
                          className="bg-blue-500 hover:bg-blue-800 text-white px-2 py-1 rounded-md"
                          onClick={() => {
                            handleNextClick(appointment.patient_id);
                          }}
                        >
                          Next
                        </button>
                      ) : (
                        <span className="text-green-500">Viewed</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <button type="button" className="bg-red-500 hover:bg-red-800 text-white px-2 py-1 rounded-md">
                        Delete
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex justify-center items-center w-fit h-fit gap-3">
                        <button type="button" className="bg-blue-500 hover:bg-blue-800 text-white px-2 py-1 rounded-md">
                          <ChevronUpIcon className="h-5 w-5" />
                        </button>
                        <button type="button" className="bg-blue-500 hover:bg-blue-800 text-white px-2 py-1 rounded-md">
                          <ChevronDownIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="mt-4">No appointments available.</p>
          )}
        </div>
      </div>
    </div>
  );  
}

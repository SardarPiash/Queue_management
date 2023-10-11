import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NavBarV2 from "./themeV2";
import axios from "axios";

function ViewDocList() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [appointment, setAppoinment] = useState("");

  useEffect(() => {
    setAppoinment("");
    const token = localStorage.getItem("jwtoken");
    const userData = localStorage.getItem("user");
    const hospitalData = localStorage.getItem("hid");
    const hospitalDataParse = JSON.parse(hospitalData);

    if (!hospitalData) {
      router.push("/patient/dashboard");
      return;
    }

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const userDataParse = JSON.parse(userData);
    const role = userDataParse.role;
    if (!role && role !== 0) {
      router.push("/login");
      return;
    }

    if (Array.isArray(hospitalDataParse) && hospitalDataParse.length > 0) {
      setDoctors(hospitalDataParse);
    }
  }, [router]);

  const takeAppointment = async (uid) => {
    setAppoinment("");
    const userData = localStorage.getItem("user");
    const userDataParse = JSON.parse(userData);
    const id = userDataParse.id;
    const token = localStorage.getItem("jwtoken");
    const response = await axios.post(
      `http://127.0.0.1:8000/api/create/appointment`,
      {
        patient_id: id,
        doctor_id: uid,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(id);
    console.log(uid);

    if (response.data.message === "Doctor doest not have visiting time today") {
      setAppoinment(response.data.message);
      return;
    } else if (
      response.data.message === "Doctor doest not have visiting time today"
    ) {
      setAppoinment(response.data.message);
      return;
    } else {
      router.push("/patient/viewAppoinment");
      return;
    }
  };

  return (
    <>
      <NavBarV2 />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-4">Doctors List</h1>
        {appointment && (
          <p className="text-center text-s text-red-500"> {appointment}</p>
        )}
        <ul>
          {doctors.map((doctor, index) => (
            <li key={index} className="mb-4 border p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">
                Doctor Name: {doctor.user.first_name} {doctor.user.last_name}
              </h2>
              <p>Email: {doctor.user.email}</p>
              <p>Phone: {doctor.user.phone}</p>
              <p>Specialization: {doctor.doctor.specialization}</p>
              <p>Visiting Days: {doctor.doctor.visitingDay}</p>
              <p>Visiting Time: {doctor.doctor.visitingTime}</p>
              <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-0.5 px-1 rounded-lg"
                    onClick={() => {
                      takeAppointment(doctor.doctor.uid);
                    }}
                  >
                    Take Appoinment
                  </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default ViewDocList;

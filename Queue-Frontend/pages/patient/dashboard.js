import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import axios from "axios";
import NavBar from "./theme";

function Dashboard() {
  const router = useRouter();
  const { handleSubmit } = useForm();
  const [noSearch, setNoSearch] = useState("");
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [searched, setSearched] = useState(false);
  const [appointment, setAppoinment] = useState("");
  const [hosFound, setHosFound] = useState("");

  useEffect(() => {
    setAppoinment("");
    const token = localStorage.getItem("jwtoken");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      router.push("/login");
      return;
    }
    setSearched(false);

    const userDataParse = JSON.parse(userData);
    const role = userDataParse.role;
    if (!role && role !== 0) {
      router.push("/login");
      return;
    }
  }, [router]);

  const onSubmit = async () => {
    if (!search) {
      setNoSearch("Enter a Doctor or Hospital Name");
      return;
    } else {
      try {
        const token = localStorage.getItem("jwtoken");
        const response = await axios.post(
          `http://127.0.0.1:8000/api/search/active`,
          {
            query: search,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setDoctors(response.data.doctors);
        setHospitals(response.data.hospitals);
        setSearched(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

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

    if (response.data.message === "Doctor doest not have visiting time today") {
      setAppoinment(response.data.message);
    } else if (
      response.data.message === "Doctor doest not have visiting time today"
    ) {
      setAppoinment(response.data.message);
    } else {
      router.push("/patient/viewAppoinment");
      return;
    }
  };

  const viewHospitalDoc = async (hid) => {
    setHosFound("");
    const token = localStorage.getItem("jwtoken");
    //localStorage.setItem("hid",hid);
    const response = await axios.get(
      `http://127.0.0.1:8000/api/doctor/hospital/${hid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.message === "No doctor found.") {
      setHosFound(response.data.message);
    } else {
      console.log(response.data);
      localStorage.setItem("hid", JSON.stringify(response.data));
      router.push("/patient/viewDocList");
      return;
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen flex flex-col items-center justify-center">
        {searched ? (
          <h1 className="text-3xl font-semibold mb-10 text-center">
            Search Result
          </h1>
        ) : (
          <h1 className="text-3xl font-semibold mb-10 text-center">
            Patient Dashboard
          </h1>
        )}
        {appointment && (
          <p className="text-center text-s text-red-500"> {appointment}</p>
        )}
        {hosFound && (
          <p className="text-center text-s text-red-500"> {hosFound}</p>
        )}
        <div className="absolute top-9 right-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">
            Search Doctor or Hospital to take appointment
          </h4>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              className="border rounded-lg px-4 py-2 mr-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Search..."
              name="search"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
              type="submit"
            >
              Search
            </button>
          </form>
          <p className={noSearch ? "text-red-500" : ""}>{noSearch}</p>
        </div>
        {searched ? (
          <div className="bg-white p-6 shadow-md rounded-lg mt-4">
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="border p-4 rounded-lg">
                  <h2 className="text-xl font-semibold">
                    Doctor Name: {doctor.first_name} {doctor.last_name}
                  </h2>
                  <p>Phone: {doctor.phone}</p>
                  <p>Gender: {doctor.gender}</p>
                  <p>Email: {doctor.email}</p>
                  <p>Address: {doctor.address}</p>
                  <p>Visiting Day: {doctor.visitingDay}</p>
                  <p>Visiting Hour: {doctor.visitingTime}</p>
                  <p>Hospital Name: {doctor.hospitalname}</p>
                  <p>Location: {doctor.location}</p>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-0.5 px-1 rounded-lg"
                    onClick={() => {
                      takeAppointment(doctor.uid);
                    }}
                  >
                    Take Appoinment
                  </button>
                  {}
                </div>
              ))}
              {hospitals.map((hospital) => (
                <div key={hospital.id} className="border p-4 rounded-lg">
                  <h2 className="text-xl font-semibold">
                    Hospital Name: {hospital.hospitalname}
                  </h2>
                  <p>Location: {hospital.location}</p>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-0.5 px-1 rounded-lg"
                    onClick={() => {
                      viewHospitalDoc(hospital.id);
                    }}
                  >
                    See Doctor List
                  </button>
                  {}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div id="noClicked">
            <div className="bg-white p-8 shadow-md rounded-lg mt-4">
              <div className="space-y-4">
                <Link href="/patient/viewAppoinment">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mr-4"
                    type="button"
                  >
                    View Appointment
                  </button>
                </Link>
                <Link href="/patient/viewProfile">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mr-4"
                    type="button"
                  >
                    View Profile
                  </button>
                </Link>
                <Link href="/patient/updateProfile">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                    type="button"
                  >
                    Update Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;

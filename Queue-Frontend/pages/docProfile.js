import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

function DocProfile() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [docInfo, setDocInfo] = useState({});

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const jwttoken = localStorage.getItem("jwtoken");

    if (!userString || !jwttoken) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userString);
    const userRole = user.role;

    if (userRole !== 2) {
      router.push("/login");
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("jwtoken");
      const userString = localStorage.getItem("user");
      const user = JSON.parse(userString);
      const uid = parseInt(user.id);
      const response = await axios.get(
        `http://127.0.0.1:8000/api/doctor/about/${uid}`,
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

      if (response.data.message === "No user found.") {
        setError("No user found");
      }
       else if (response.data.message === "User is not a doctor.") {
        setError("User is not a doctor.");
      } else {
        setDocInfo(response.data);
      }
    } catch (error) {
      console.error("Error fetching doctor information:", error);
    }
  };

  return (
    <div>
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
      <div className="container mx-auto mt-8 px-4 py-2">
        <div className="bg-white p-4 shadow-md rounded-md">
          <div>{error && <p>{error}</p>}</div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Doctor Profile</h2>
            <p className="mb-2">
              <span className="font-semibold">Doctor Name:</span>{" "}
              {docInfo.first_name} {docInfo.last_name}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Phone:</span> {docInfo.phone}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Gender:</span> {docInfo.gender}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Email:</span> {docInfo.email}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Address:</span> {docInfo.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );  
}

export default DocProfile;

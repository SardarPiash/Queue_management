import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link";

function UpdateProfileDoctor() {
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [gender, setGender] = useState("");
  const [genderError, setGenderError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [specialization, setSpecialization] = useState("");
  const [specializationError, setSpecializationError] = useState("");
  const [hospitalid, setHospitalid] = useState("");
  const [hospitalidError, setHospitalidError] = useState("");
  const {handleSubmit}=useForm();

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
  }, [router]);

  const onSubmit = async (data) => {
    setFirstNameError("");
    setLastNameError("");
    setGenderError("");
    setEmailError("");
    setPhoneError("");
    setConfirmPasswordError("");
    setPasswordError("");
    setAddressError("");
    setHospitalidError("");
    setSpecializationError("");

    if (!firstName) {
      setFirstNameError("Enter Your First Name");
      return;
    }

    if (!lastName) {
      setLastNameError("Enter Your Last Name");
      return;
    }
    if (!phone) {
      setPhoneError("Enter Your Phone Number");
      return;
    }
    if (!gender) {
      setGenderError("Select Your Gender");
      return;
    }
    if (!email) {
      setEmailError("Enter Your Email");
      return;
    }
    if (!password) {
      setPasswordError("Enter Your Password");
      return;
    }
    if (!confirm_password) {
      setConfirmPasswordError("Enter Confirm Password");
      return;
    }
    if (password !== confirm_password) {
      setConfirmPasswordError("Confirm Password Should be same as Password");
      return;
    }
    if (!address) {
      setAddressError("Enter Your Address");
      return;
    }
    if (!specialization) {
      setSpecializationError("Enter the specialization");
      return;
    }
    if (!hospitalid) {
      setHospitalidError("Enter the Hospital ID");
      return;
    }

    try {
      const token = localStorage.getItem("jwtoken");
      const userString = localStorage.getItem("user");
      const user = JSON.parse(userString);
      const uid = parseInt(user.id);
      const response = await axios.put(
        `http://127.0.0.1:8000/api/doctor/update`,
        {
          uid,
          firstName,
          lastName,
          phone,
          gender,
          email,
          address,
          password,
          confirm_password,
          specialization,
          hospitalid,
        },
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
      console.log(response.data.message);
      if (response.data.message === "Doctor information updated successfully") {
        router.push("/docProfile");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
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
      <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Update Doctor Profile</h1>
      <p>{error && <p className="text-red-500">{error}</p>}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-700">
            First Name:
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="Enter your First name"
            onChange={(e) => setFirstName(e.target.value)}
            className="input-field"
          />
          {firstNameError && <p className="text-red-500">{firstNameError}</p>}
        </div>
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-700">
            Last Name:
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="Enter your Last name"
            onChange={(e) => setLastName(e.target.value)}
            className="input-field"
          />
          {lastNameError && <p className="text-red-500">{lastNameError}</p>}
        </div>
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-700">Phone:</label>
          <input
            type="tel"
            name="phone"
            placeholder="01XXXXXXXXX"
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
          />
          {phoneError && <p className="text-red-500">{phoneError}</p>}
        </div>
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-700">Gender:</label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                onChange={(e) => setGender(e.target.value)}
              />
              <label
                htmlFor="male"
                className="text-sm font-semibold text-gray-700"
              >
                Male
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                onChange={(e) => setGender(e.target.value)}
              />
              <label
                htmlFor="female"
                className="text-sm font-semibold text-gray-700"
              >
                Female
              </label>
            </div>
          </div>
          {genderError && <p className="text-red-500">{genderError}</p>}
        </div>
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            placeholder="john.doe@example.com"
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          {emailError && <p className="text-red-500">{emailError}</p>}
        </div>
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-700">
            Password:
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          {passwordError && <p className="text-red-500">{passwordError}</p>}
        </div>
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-700">
            Confirm Password:
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Your Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
          />
          {confirmPasswordError && (
            <p className="text-red-500">{confirmPasswordError}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-700">
            Address:
          </label>
          <textarea
            rows={2}
            name="address"
            placeholder="Enter Your Address"
            onChange={(e) => setAddress(e.target.value)}
            className="textarea-field"
          />
          {addressError && <p className="text-red-500">{addressError}</p>}
        </div>
        <div>
          <label htmlFor="specialization">Specialization:</label>
          <input
            type="text"
            name="specialization"
            id="specialization"
            onChange={(e) => setSpecialization(e.target.value)}
          />
          {specializationError && <p>{specializationError}</p>}
        </div>
        <div>
          <label htmlFor="hospitalid">Hospital id:</label>
          <input
            type="number"
            id="hospitalid"
            name="hospitalid"
            onChange={(e) => setHospitalid(e.target.value)}
          />
          {hospitalidError && <p>{hospitalidError}</p>}
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          type="submit"
        >
          Update Profile
        </button>
        {/* {error && <p className="text-red-500">{error}</p>} */}
      </form>
    </div>
    </div>

    
  );
}

export default UpdateProfileDoctor;

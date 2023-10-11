import Link from "next/link";
import React from "react";

function NavBarV2() {
  return (
    <div className="bg-blue-500 p-4 shadow-md">
      <div className="container mx-auto flex items-center">
        <div className="space-x-20">
          <Link href="/patient/dashboard" className="text-white hover:underline">
            Dashboard
          </Link>
          <Link href="/patient/updateProfile" className="text-white hover:underline">
            Update Profile
          </Link>
          <Link href="/patient/viewAppoinment" className="text-white hover:underline">
            View Appointment
          </Link>
          <Link href="/logout" className="text-white hover:underline">
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NavBarV2;

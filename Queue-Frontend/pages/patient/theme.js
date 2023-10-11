import Link from "next/link";
import React from "react";

function NavBar() {
  return (
    <div className="bg-blue-500 p-4 shadow-md">
      <div className="container mx-auto flex items-left">
        <div className="space-x-5">
          <Link href="/patient/dashboard" className="text-white hover:underline">
            Dashboard
          </Link>
          <Link href="/logout" className="text-white hover:underline">
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NavBar;

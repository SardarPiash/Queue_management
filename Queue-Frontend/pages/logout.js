import React from "react";
import { useRouter } from "next/router";
import axios from "axios"; 

 function logout() {
  const router = useRouter();
  try {
    const response =  axios.get('http://localhost:8000/api/logout', {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('jwtoken')}`,
      },
    });
    console.log(response.data);
    localStorage.clear();
    router.push('/login');
  } catch (error) {
    console.error(error);
  }
}

export default logout;

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/layout";
import IsLoggedIn from "../components/isloggedin";
import Loading from "../loading";

export default function ShowAllDoctor() {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/doctor/all', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtoken')}`,
            },
            withCredentials: true,
          });
  
          setData(response.data);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        }
      };
  
      // Call fetchData when the component mounts and after updating admin data
      fetchData();
    }, []);


    const deleteDoctor = (id) => {
        axios.delete(`http://localhost:8000/api/doctor/delete/${id}`, {
            headers:
            {
                "Authorization": `Bearer ${localStorage.getItem('jwtoken')}`,

            },
            withCredentials: true
        })
            .catch((error) => {
                console.error('Error deleting task:', error);
            });

    };


    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
    };
    const headerCellStyle = {
        backgroundColor: '#87CEEB',
    };
    const cellStyle = {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'left',
        backgroundColor: '#FFFFFF',
        textColor: '#000000'
    };

    const pgrole = 1;
    return (
        <>
            <IsLoggedIn pgrole={pgrole} />
            {isLoading && <Loading />}
            <Layout title="All Doctors - Medical Service">
                <section className="flex justify-center">
                    <div className="flex flex-col justify-center items-center w-full min-h-screen max-w-[1600px] py-[75px]">
                        <div className="hover:bg-cyan-200  text-4xl text-center text-black bg-slate-200 p-2">
                            <h1> All Doctor List </h1>
                        </div>


                        <div>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={headerCellStyle}>Doctor ID</th>
                                        <th style={headerCellStyle}>First Name</th>
                                        <th style={headerCellStyle}>Last Name</th>
                                        <th style={headerCellStyle}>Gender</th>
                                        <th style={headerCellStyle}>Phone</th>
                                        <th style={headerCellStyle}>Email</th>
                                        <th style={headerCellStyle}>Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.length > 0 &&
                                        data.map((item, index) => (
                                            <tr key={index}>
                                                <td style={cellStyle}>{item.id}</td>
                                                <td style={cellStyle}>{item.first_name}</td>
                                                <td style={cellStyle}>{item.last_name}</td>
                                                <td style={cellStyle}>{item.gender}</td>
                                                <td style={cellStyle}>{item.phone}</td>
                                                <td style={cellStyle}>{item.email}</td>
                                                <td style={cellStyle}>{item.address}</td>
                                                <td>
                                                    <button type="button" className="btn btn-danger" onClick={() => { deleteDoctor(item.id) }}>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    {
                                        data.length === 0 &&
                                        <tr>
                                            <td colSpan="8" style={cellStyle}>No Doctors found.</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
}

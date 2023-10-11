import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/layout";
import IsLoggedIn from "../components/isloggedin";
import Loading from "../loading";


export default function ShowAllPatient() {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const apiUrl = 'http://localhost:8000/api/patient/all';

        axios.get(apiUrl,
            {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('jwtoken')}`,
                },
                withCredentials: true
            })
            .then((response) => {
                setData(response.data); // Set the fetched data
                setIsLoading(false); // Set loading to false
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setIsLoading(false); // Set loading to false in case of an error
            });
    }, []);

    const deletePatient = (id) => {
        axios.delete(`http://localhost:8000/api/patient/delete/${id}`, 
            {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('jwtoken')}`,
                },
                withCredentials: true
            }).catch((error) => {
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
            <Layout title="All Patients - Medical Service">
                <section className="flex justify-center">
                    <div className="flex flex-col justify-center items-center w-full min-h-screen max-w-[1600px] py-[75px]">
                        <div className="hover:bg-cyan-200  text-4xl text-center text-black bg-slate-200 p-2">
                            <h1> All Patient List </h1>
                        </div>


                        <div>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={headerCellStyle}>Patient ID</th>
                                        <th style={headerCellStyle}>First Name</th>
                                        <th style={headerCellStyle}>Last Name</th>
                                        <th style={headerCellStyle}>Gender</th>
                                        <th style={headerCellStyle}>Phone</th>
                                        <th style={headerCellStyle}>Email</th>
                                        <th style={headerCellStyle}>Address</th>
                                        <th style={headerCellStyle}>Action</th>
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
                                                    <button type="button" className="btn btn-danger" onClick={() => { deletePatient(item.id) }}>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    {
                                        data.length === 0 &&
                                        <tr>
                                            <td colSpan="8" style={cellStyle}>No record found.</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>

                        {/*<div>*/}
                        {/*    {isLoading ? (*/}
                        {/*        <p>Loading...</p>*/}
                        {/*    ) : (*/}
                        {/*        <div>*/}
                        {/*            /!* Display your fetched data here *!/*/}
                        {/*            <pre>{JSON.stringify(data, null, 2)}</pre>*/}
                        {/*        </div>*/}
                        {/*    )}*/}
                        {/*</div>*/}

                    </div>
                </section>
            </Layout>
        </>
    );
}

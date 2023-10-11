import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import axios from "axios";
import Layout from "../components/layout";
import IsLoggedIn from "../components/isloggedin";
import Loading from "../loading";


export default function ShowAllHospital() {


    const shouldRedirect = false;
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await axios.get(`http://localhost:8000/api/hospital/all`, {
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
    
    

    const deleteHospital = (id) => {
        axios.delete(`http://localhost:8000/api/hospital/delete/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtoken')}`,
                },
                withCredentials: true,
            }).catch((error) => {
                console.error('Error deleting task:', error);
            });
    };

    // const editHospital = (id) => {
    //     router.push(`/editHospital?id=${id}`);
    // }

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
            <Layout title="All Hospitals - Medical Service">
                <section className="flex justify-center">
                    <div className="flex flex-col justify-center items-center w-full min-h-screen max-w-[1600px] py-[75px]">
                        <div className="hover:bg-cyan-200  text-4xl text-center text-black bg-slate-200 p-2">
                            <h1> All Hospital List </h1>
                        </div>


                        <div>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={headerCellStyle}>Hospital ID</th>
                                        <th style={headerCellStyle}>Hospital Name</th>
                                        <th style={headerCellStyle}>Hospital Location</th>
                                        <th style={headerCellStyle}>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.length > 0 &&
                                        data.map((item, index) => (
                                            <tr key={index}>
                                                <td style={cellStyle}>{item.id}</td>
                                                <td style={cellStyle}>{item.hospitalname}</td>
                                                <td style={cellStyle}>{item.location}</td>
                                                <td>
                                                    {/*<Link pathname={`/editHospital/${item.id}`}>*/}
                                                    {/*    Edit*/}
                                                    {/*</Link>&nbsp;*/}
                                                    {/*<Link className="btn btn-info" to={{ pathname: `/editHospital/${item.id}`, state: { item } }}>Edit</Link>&nbsp;*/}
                                                    <button type="button" className="btn btn-danger" onClick={() => { deleteHospital(item.id) }}>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    {
                                        data.length === 0 &&
                                        <tr>
                                            <td colSpan="4" style={cellStyle}>No Hospital Found.</td>
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

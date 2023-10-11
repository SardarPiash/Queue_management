import Link from "next/link";
import Layout from "../components/layout";
import IsLoggedIn from "../components/isloggedin";


export default function SuperAdmin() {


    const pgrole = 1;
    return (
        <>
            <IsLoggedIn pgrole={pgrole} />
            <Layout title="Super-Admin Dashboard - Medical Service">
                <section className="flex justify-center">
                    <div className="flex flex-col justify-center items-center w-full min-h-screen max-w-[1600px] py-[75px]">

                        <div className="hover:bg-cyan-200  text-4xl text-center text-black bg-slate-200 p-2">
                            <h1> Welcome Super Admin! </h1>
                        </div>

                        <div className="mt-4 flex items-center justify-center">

                            <img src="../q.png" className=""></img>

                        </div>
                        <br></br>
                        <br></br>


                        <div className=" flex items-center justify-center gap-10 p-4">
                            <Link className="btn btn-outline bg-sky-100  hover:bg-blue-500" href="/superadmin/register_doctor" > NewDoctor Register </Link>
                            <Link className="btn btn-outline bg-sky-100  hover:bg-blue-500" href="/superadmin/register_hospital" > NewHospital Register </Link>
                            <Link className="btn btn-outline bg-sky-100  hover:bg-blue-500" href="/superadmin/register_admin" > Admin Register </Link>
                        </div>

                    </div>
                </section>
            </Layout>
        </>
    );

}

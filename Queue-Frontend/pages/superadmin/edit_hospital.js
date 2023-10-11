import { useRouter } from 'next/router';
import Layout from "../components/layout";
import IsLoggedIn from "../components/isloggedin";
import Loading from "../loading";

export default function editHospital() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { id } = router.query;


    const pgrole = 1;
    return (
        <>
            <IsLoggedIn pgrole={pgrole} />
            {isLoading && <Loading />}
            <Layout title="Edit Hospital - Medical Service">
                <section className="flex justify-center">
                    <div className="flex flex-col justify-center items-center w-full min-h-screen max-w-[1600px] py-[75px]">

                        <div>
                            <h1>Edit Hospital</h1>
                            <p>ID: {id}</p>
                        </div>

                    </div>
                </section>
            </Layout>
        </>
    );
}

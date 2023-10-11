import Image from "next/image";

export default function Loading() {

    return (
        <>
            <div className="fixed flex justify-center items-center w-screen h-screen z-[200] p-4 bg-slate-50">
                <Image src="/loading_48.png" alt="loading" width={40} height={40} className="animate-[spin_1.2s_linear_infinite]" />
            </div>
        </>
    );

}

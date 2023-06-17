import Sidebar from "../../../components/sidebar";
import Head from 'next/head';




export default function projectView() {




    return (
        <>
            <Head>
                <link rel="icon" href="/icons8-clock-16.png" />
                <title>Task Manager</title>
            </Head>
            <div>
                <div>
                    <Sidebar />
                    <main className="ml-60 pt-16 h-screen bg-amber-100 overflow-auto">
                        <div className="px-6 py-8">

                            <h1 className="text-3xl ml-8 ">Projects</h1>

                            <div className="mt-8 max-w-4x1 mx-auto">

                                <div className="border font-sans border-neutral-300 max-w-full h-25 bg-slate-50">
                                    <div className="border border-b-gray-300 max-w-full h-11 bg-slate-100">
                                        <p className="px-3 py-2">Projects</p>
                                    </div>
                                    <div className="bg-white flex  uppercase font-sans ">
                                        <div className="px-5 py-2 w-2/4 h-10">
                                            <p >Name</p>
                                        </div>
                                        <div className="w-2/4 h-10">
                                            <p className="px py-2">Tracked</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex border border-x-fuchsia-200 max-w-full h-16 bg-white">
                                    <div className=" border-r px-5 py-5 w-2/4 h-15">
                                        <p>Cloning</p>
                                    </div>

                                    <div className=" border-r w-2/4 h-15">
                                        <p className="px-5 py-5">300h</p>
                                    </div>
                                    <div className="px-4 py-3">
                                        Dropdown

                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>

    );

}

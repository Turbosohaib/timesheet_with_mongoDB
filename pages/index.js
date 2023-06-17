import Head from 'next/head'
import clientPromise from "../util/mongodb"
import { EJSON } from "bson";
import { useRouter } from 'next/router'
import axios from 'axios';
import { useState } from 'react';




export async function getServerSideProps(ctx) {

    const client = await clientPromise;

    const db = client.db("Projects_timesheet")
    const Users = EJSON.serialize(await db
        .collection("Users")
        .find({})
        .toArray());


    return {
        props: {
            Users
        }
    }
}


export default function signUp({ Users }) {

    const [message, setMessage] = useState(null);

    console.log(message);


    const router = useRouter()

    async function handleSubmit(e) {
        e.preventDefault();
        let email = e.target.email;
        let password = e.target.password;

        let user = {
            email: email.value,
            password: password.value
        }



        try {
            const result = await axios.post('/api/login', { data: user });

            if (result.data.message) {
                // User login successful, redirect to dashboard
                setMessage({ status: true, text: result.data.message });
                router.push('/dashboard');
            } else {
                // User login failed, display error message
                setMessage({ status: false, text: result.data.error });
            }
        } catch (error) {
            // Handle any errors that occurred during the request
            console.error(error);
            setMessage({ status: false, text: 'An error occurred during the login process.' });
        }
    }






    return (
        <div>
            <Head>
                <link rel="icon" href="/icons8-clock-16.png" />
                <title>Task Manager</title>
            </Head>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-8 h-8 mr-2" src="/icons8-clock-16.png" alt="logo" />
                        Task Manager
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Login to Task Manager
                            </h1>
                            {message ? (
                                <div
                                    className={`flex items-center ${message.status ? 'bg-blue-500' : 'bg-red-500'} text-white text-sm font-bold px-4 py-3`}
                                    role='alert'
                                >
                                    <p>{message.text}</p>
                                </div>
                            ) : (
                                ''
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter email</label>
                                    <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                </div>
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                                    </div>
                                </div>

                                <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Login
                                </button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don't have an account? <a href="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Register here</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    )

}
import React, { useEffect, useState } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import jwt from "jsonwebtoken";
import HomePage from '../pages/HomePage/HomePage';
import SignIn from '../pages/SignIn/SignIn';
import SignUp from '../pages/SignUp/SignUp';
import adminRouter from './adminRouter';
import doctorRouter from './doctorRouter';
import staffRouter from './staffRouter';
import patientRouter from './patientRouter';
import Page404 from '../pages/Page404/Page404';

export const AuthContext = React.createContext();

export default function MyRouter() {
    const [userType, setUserType] = useState(
        jwt.decode(localStorage.getItem("accessToken"))?.userType
    );
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const payload = token && jwt.decode(token);
        const userTyp = payload && payload.userType;
        setUserType(userTyp && userTyp);
    }, []);

    const routes = [
        {
            path: '/',
            element: <HomePage />
        },
        {
            path: '/signin',
            element: userType ? (
                <Navigate to={`/dashboard/${userType}`} />
            ) : (
                <AuthContext.Provider value={{ setUserType }}>
                    <SignIn />
                </AuthContext.Provider>
            ),
        },
        {
            path: '/signup',
            element: userType ? <Navigate to={`/dashboard/${userType}`} /> : <SignUp />
        },
        // userType === "admin" && { ...adminRouter(setUserType) },
        // userType === "doctor" && { ...doctorRouter(setUserType) },
        // userType === "patient" && { ...patientRouter(setUserType) },
        // userType === "staff" && { ...staffRouter(setUserType) },
    ]

    if (userType === "admin") {
        console.log("registering admin routes")
        adminRouter(setUserType).forEach((r) => {
            console.log(r)
            routes.push(r)
        })
    } else if (userType === "doctor") {
        console.log("registering doctor routes")
        doctorRouter(setUserType).forEach((r) => {
            routes.push(r)
        })
    } else if (userType === "patient") {
        console.log("registering patient routes")
        patientRouter(setUserType).forEach((r) => {
            routes.push(r)
        })
    } else if (userType === "staff") {
        console.log("registering staff routes")
        staffRouter(setUserType).forEach((r) => {
            routes.push(r)
        })
    }

    routes.push({
        path: '*',
        element: <AuthContext.Provider value={{ userType }}>
            <Page404 />
        </AuthContext.Provider>,
    })

    const router = createBrowserRouter(routes)

    return (
        <RouterProvider router={router} />
    )
}

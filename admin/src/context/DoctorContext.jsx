import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(null);
    const [profileData, setProfileData] = useState(null);

    // Handle 401 errors (logout user)
    const handleUnauthorized = () => {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("dToken");
        setDToken("");
    };

    // Axios instance with headers
    const axiosInstance = axios.create({
        baseURL: backendUrl,
        headers: {
            Authorization: dToken ? `Bearer ${dToken}` : "",
        },
    });

    // Fetch doctor appointments
    const getAppointments = async () => {
        if (!dToken) return;
        try {
            const { data } = await axiosInstance.get("/api/doctor/appointments");

            if (data.success) {
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Appointments fetch error:", error);
            if (error.response?.status === 401) handleUnauthorized();
        }
    };

    // Fetch doctor profile
    const getProfileData = async () => {
        if (!dToken) return;
        try {
            const { data } = await axiosInstance.get("/api/doctor/profile");
            setProfileData(data.profileData);
        } catch (error) {
            console.error("Profile fetch error:", error);
            if (error.response?.status === 401) handleUnauthorized();
        }
    };

    // Fetch doctor dashboard data
    const getDashData = async () => {
        if (!dToken) return;
        try {
            const { data } = await axiosInstance.get("/api/doctor/dashboard");

            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Dashboard fetch error:", error);
            if (error.response?.status === 401) handleUnauthorized();
        }
    };

    // Cancel an appointment
    const cancelAppointment = async (appointmentId) => {
        if (!dToken) return;
        try {
            const { data } = await axiosInstance.post("/api/doctor/cancel-appointment", { appointmentId });

            if (data.success) {
                toast.success(data.message);
                getAppointments();
                getDashData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Cancel appointment error:", error);
            if (error.response?.status === 401) handleUnauthorized();
        }
    };

    // Mark appointment as completed
    const completeAppointment = async (appointmentId) => {
        if (!dToken) return;
        try {
            const { data } = await axiosInstance.post("/api/doctor/complete-appointment", { appointmentId });

            if (data.success) {
                toast.success(data.message);
                getAppointments();
                getDashData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Complete appointment error:", error);
            if (error.response?.status === 401) handleUnauthorized();
        }
    };

    // Auto-fetch data on mount
    useEffect(() => {
        getAppointments();
        getProfileData();
        getDashData();
    }, [dToken]);

    const value = {
        dToken, setDToken, backendUrl,
        appointments, getAppointments,
        cancelAppointment, completeAppointment,
        dashData, getDashData,
        profileData, getProfileData,
    };

    return (
        <DoctorContext.Provider value={value}>
            {children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;

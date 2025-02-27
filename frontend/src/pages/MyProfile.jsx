import { useContext, useState, useEffect, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(null);
    
    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext);

    // ✅ Create User Profile Function
    const createUserProfile = useCallback(async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/create-profile`, userData, {
                headers: { token },
            });
            if (data.success) {
                toast.success('Profile created successfully!'); // ✅ Added success message
                loadUserProfileData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating profile.');
        }
    }, [backendUrl, userData, token, loadUserProfileData]);

    // ✅ Automatically Create Profile If Not Exists
    useEffect(() => {
        if (!userData) {
            createUserProfile();
        }
    }, [userData, createUserProfile]);

    // ✅ Update Profile Function
    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();
    
            if (userData.name) formData.append("name", userData.name);
            if (userData.phone) formData.append("phone", userData.phone);
            if (userData.gender) formData.append("gender", userData.gender);
            if (userData.dob) formData.append("dob", userData.dob);
            if (image) formData.append("image", image);
    
            // Fix Address Format
            if (userData.address) {
                formData.append("address", JSON.stringify(userData.address));
            }
    
            const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
                headers: { token, "Content-Type": "multipart/form-data" },
            });
    
            if (data.success) {
                toast.success("Profile updated successfully!");
                loadUserProfileData();
                setIsEdit(false);
                setImage(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile.");
        }
    };
    
    return userData ? (
        <div className="max-w-lg flex flex-col gap-2 text-sm pt-5">
            {/* Profile Image */}
            {isEdit ? (
                <label htmlFor="image">
                    <div className="inline-block relative cursor-pointer">
                        <img
                            className="w-36 rounded opacity-75"
                            src={image ? URL.createObjectURL(image) : userData.image}
                            alt="Profile"
                        />
                        <img
                            className="w-10 absolute bottom-12 right-12"
                            src={image ? '' : assets.upload_icon}
                            alt="Upload Icon"
                        />
                    </div>
                    <input
                        onChange={(e) => setImage(e.target.files[0])}
                        type="file"
                        id="image"
                        hidden
                    />
                </label>
            ) : (
                <img className="w-36 rounded" src={userData.image} alt="Profile" />
            )}

            {/* Name */}
            {isEdit ? (
                <input
                    className="bg-gray-50 text-3xl font-medium max-w-60"
                    type="text"
                    onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                    value={userData.name || ''}
                />
            ) : (
                <p className="font-medium text-3xl text-[#262626] mt-4">{userData.name}</p>
            )}

            <hr className="bg-[#ADADAD] h-[1px] border-none" />

            {/* Contact Information */}
            <div>
                <p className="text-gray-600 underline mt-3">CONTACT INFORMATION</p>
                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]">
                    <p className="font-medium">Email id:</p>
                    <p className="text-blue-500">{userData.email}</p>

                    <p className="font-medium">Phone:</p>
                    {isEdit ? (
                        <input
                            className="bg-gray-50 max-w-52"
                            type="text"
                            onChange={(e) =>
                                setUserData((prev) => ({ ...prev, phone: e.target.value }))
                            }
                            value={userData.phone || ''}
                        />
                    ) : (
                        <p className="text-blue-500">{userData.phone}</p>
                    )}

                    <p className="font-medium">Address:</p>
                    {isEdit ? (
                        <p>
                            <input
                                className="bg-gray-50"
                                type="text"
                                placeholder="Line 1"
                                onChange={(e) =>
                                    setUserData((prev) => ({
                                        ...prev,
                                        address: { ...prev.address, line1: e.target.value },
                                    }))
                                }
                                value={userData.address?.line1 || ''}
                            />
                            <br />
                            <input
                                className="bg-gray-50"
                                type="text"
                                placeholder="Line 2"
                                onChange={(e) =>
                                    setUserData((prev) => ({
                                        ...prev,
                                        address: { ...prev.address, line2: e.target.value },
                                    }))
                                }
                                value={userData.address?.line2 || ''}
                            />
                        </p>
                    ) : (
                        <p className="text-gray-500">
                            {userData.address?.line1 || ''} <br /> {userData.address?.line2 || ''}
                        </p>
                    )}
                </div>
            </div>

            {/* Basic Information */}
            <div>
                <p className="text-[#797979] underline mt-3">BASIC INFORMATION</p>
                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
                    <p className="font-medium">Gender:</p>
                    {isEdit ? (
                        <select
                            className="max-w-20 bg-gray-50"
                            onChange={(e) =>
                                setUserData((prev) => ({ ...prev, gender: e.target.value }))
                            }
                            value={userData.gender || 'Not Selected'}
                        >
                            <option value="Not Selected">Not Selected</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    ) : (
                        <p className="text-gray-500">{userData.gender}</p>
                    )}

                    <p className="font-medium">Birthday:</p>
                    {isEdit ? (
                        <input
                            className="max-w-28 bg-gray-50"
                            type="date"
                            onChange={(e) =>
                                setUserData((prev) => ({ ...prev, dob: e.target.value }))
                            }
                            value={userData.dob || ''}
                        />
                    ) : (
                        <p className="text-gray-500">{userData.dob}</p>
                    )}
                </div>
            </div>

            {/* Edit/Save Button */}
            <div className="mt-10">
                {isEdit ? (
                    <button
                        onClick={updateUserProfileData}
                        className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
                    >
                        Save information
                    </button>
                ) : (
                    <button
                        onClick={() => setIsEdit(true)}
                        className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
                    >
                        Edit
                    </button>
                )}
            </div>
        </div>
    ) : null;
};

export default MyProfile;

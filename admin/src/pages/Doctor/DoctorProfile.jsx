import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {
    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {
        try {
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            }

            const { data } = await axios.post(
                `${backendUrl}/api/doctor/update-profile`,
                updateData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${dToken}`, // ✅ Corrected Token Format
                    },
                }
            )

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile")
            console.error("Profile update error:", error)
        }
    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken]) // ✅ Dependency fixed

    return profileData && (
        <div className='flex flex-col gap-4 m-5'>
            <div>
                <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="Doctor Profile" />
            </div>

            <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
                <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
                <div className='flex items-center gap-2 mt-1 text-gray-600'>
                    <p>{profileData.degree} - {profileData.speciality}</p>
                    <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience} years</button>
                </div>

                {/* ----- About Section ----- */}
                <div>
                    <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About:</p>
                    {
                        isEdit ?
                            <textarea 
                                onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                                className='w-full outline-primary p-2'
                                rows={4}
                                value={profileData.about}
                            /> :
                            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{profileData.about}</p>
                    }
                </div>

                {/* ----- Fees Section ----- */}
                <p className='text-gray-600 font-medium mt-4'>
                    Appointment Fee:
                    <span className='text-gray-800'>
                        {currency} 
                        {
                            isEdit ? 
                                <input 
                                    type='number' 
                                    onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                                    value={profileData.fees}
                                    className="ml-2 border p-1"
                                /> 
                                : ` ${profileData.fees}`
                        }
                    </span>
                </p>

                {/* ----- Address Section ----- */}
                <div className='flex gap-2 py-2'>
                    <p>Address:</p>
                    <p className='text-sm'>
                        {
                            isEdit ?
                                <>
                                    <input 
                                        type='text' 
                                        onChange={(e) => setProfileData(prev => ({ 
                                            ...prev, 
                                            address: { ...prev.address, line1: e.target.value } 
                                        }))}
                                        value={profileData.address.line1}
                                        className="block border p-1"
                                    />
                                    <input 
                                        type='text' 
                                        onChange={(e) => setProfileData(prev => ({ 
                                            ...prev, 
                                            address: { ...prev.address, line2: e.target.value } 
                                        }))}
                                        value={profileData.address.line2}
                                        className="block border p-1 mt-1"
                                    />
                                </>
                                :
                                <>
                                    {profileData.address.line1}
                                    <br />
                                    {profileData.address.line2}
                                </>
                        }
                    </p>
                </div>

                {/* ----- Availability Checkbox ----- */}
                <div className='flex gap-1 pt-2'>
                    <input 
                        type="checkbox" 
                        onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
                        checked={profileData.available}
                        disabled={!isEdit} // ✅ Prevents accidental toggling when not editing
                    />
                    <label>Available</label>
                </div>

                {/* ----- Buttons ----- */}
                {
                    isEdit ?
                        <button 
                            onClick={updateProfile} 
                            className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'
                        >
                            Save
                        </button> :
                        <button 
                            onClick={() => setIsEdit(true)} 
                            className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'
                        >
                            Edit
                        </button>
                }
            </div>
        </div>
    )
}

export default DoctorProfile

import React, { useEffect, useContext } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken, getAllAppointments]) // ✅ Added getAllAppointments as dependency

  return (
    <div className='w-full max-w-6xl m-5'>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>

        {/* Header Row */}
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b font-medium'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Appointment List */}
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div 
              className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50' 
              key={item._id}
            >
              <p className='max-sm:hidden'>{index + 1}</p>

              {/* Patient Info */}
              <div className='flex items-center gap-2'>
                <img 
                  src={item.userData?.image || assets.default_profile} 
                  className='w-8 h-8 rounded-full object-cover' 
                  alt="Patient" 
                />
                <p>{item.userData?.name || 'Unknown'}</p>
              </div>

              <p className='max-sm:hidden'>{item.userData?.dob ? calculateAge(item.userData.dob) : '-'}</p>

              {/* Date & Time */}
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

              {/* Doctor Info */}
              <div className='flex items-center gap-2'>
                <img 
                  src={item.docData?.image || assets.default_doctor} 
                  className='w-8 h-8 rounded-full bg-gray-200 object-cover' 
                  alt="Doctor" 
                />
                <p>{item.docData?.name || 'Unknown'}</p>
              </div>

              {/* Fees */}
              <p>{currency}{item.amount}</p>

              {/* Action Button */}
              <div>
                {item.cancelled ? (
                  <p className='text-red-500 text-xs font-medium'>Cancelled</p>
                ) : item.isCompleted ? (
                  <p className='text-green-500 text-xs font-medium'>Completed</p>
                ) : (
                  <img 
                    onClick={() => cancelAppointment(item._id)} 
                    className='w-8 cursor-pointer hover:opacity-80 transition-opacity' 
                    src={assets.cancel_icon} 
                    alt="Cancel" 
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No appointments found.</p>
        )}
      </div>

    </div>
  )
}

export default AllAppointments

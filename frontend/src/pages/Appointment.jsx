import { useContext, useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {
    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(null)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')

    const navigate = useNavigate()

    // Fetch Doctor Info
    const fetchDocInfo = useCallback(() => {
        const foundDoc = doctors.find((doc) => doc._id === docId)
        if (foundDoc) {
            setDocInfo(foundDoc)
        }
    }, [docId, doctors])

    // Get Available Slots
    const getAvailableSlots = useCallback(() => {
        if (!docInfo || !docInfo.slots_booked) return

        setDocSlots([])

        let today = new Date()

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(Math.max(currentDate.getHours() + 1, 10))
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = []

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = `${day}_${month}_${year}`
                const isSlotAvailable = !docInfo.slots_booked[slotDate]?.includes(formattedTime)

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30)
            }

            setDocSlots(prev => [...prev, timeSlots])
        }
    }, [docInfo])

    // Book appointment
    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/')
        }
    
        if (!docSlots.length || !docSlots[slotIndex]?.length) {
            toast.error('No available slots')
            return
        }
    
        const date = docSlots[slotIndex][0]?.datetime
        if (!date || !slotTime) {
            toast.error('Invalid slot selected')
            return
        }
    
        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()
    
        const slotDate = `${day}_${month}_${year}`
    
        // Ensure `userId` is included in request
        const userId = localStorage.getItem('userId') || ''  // Get userId from localStorage or state
    
        const appointmentData = { docId, slotDate, slotTime, userId } // Add userId if required
    
        try {
            console.log("Sending Appointment Data:", appointmentData)
    
            const { data } = await axios.post(
                `${backendUrl}/api/user/book-appointment`,
                appointmentData,
                { headers: { token } }
            )
    
            if (data.success) {
                toast.success(data.message)
                getDoctosData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error("Error:", error.response?.data || error.message)
            toast.error(error.response?.data?.message || 'Something went wrong')
        }
    }
    

    // Fetch doctor info on mount or when `doctors` change
    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo()
        }
    }, [doctors, docId, fetchDocInfo])

    // Fetch available slots when `docInfo` is available
    useEffect(() => {
        if (docInfo) {
            getAvailableSlots()
        }
    }, [docInfo, getAvailableSlots])

    return docInfo ? (
        <div>

            {/* ---------- Doctor Details ----------- */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-black w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
                </div>

                <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>

                    <p className='text-gray-600 font-medium mt-4'>Appointment fee: <span className='text-gray-800'>{currencySymbol}{docInfo.fees}</span> </p>
                </div>
            </div>

            {/* Booking slots */}
            <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]'>
                <p>Booking slots</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {docSlots.length > 0 && docSlots.map((item, index) => (
                        item.length > 0 && (
                            <div onClick={() => setSlotIndex(index)} key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-[#DDDDDD]'}`}>
                                <p>{daysOfWeek[item[0].datetime.getDay()]}</p>
                                <p>{item[0].datetime.getDate()}</p>
                            </div>
                        )
                    ))}
                </div>

                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {docSlots.length > 0 && docSlots[slotIndex] && docSlots[slotIndex].map((item, index) => (
                        <p onClick={() => setSlotTime(item.time)} key={index} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-[#949494] border border-[#B4B4B4]'}`}>
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                <button onClick={bookAppointment} className='bg-black text-white text-sm font-light px-20 py-3 rounded-full my-6'>Book an appointment</button>
            </div>

            {/* Listing Related Doctors */}
            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
    ) : null
}

export default Appointment

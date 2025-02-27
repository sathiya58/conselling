import { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = ({ setModel }) => {

  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const close = (e) => {
    if (e.target !== e.currentTarget) return
    setModel(false)
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      const endpoint = state === 'Sign Up' ? '/api/user/register' : '/api/user/login'
      const payload = state === 'Sign Up' ? { name, email, password } : { email, password }

      const { data } = await axios.post(`${backendUrl}${endpoint}`, payload)

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success(`${state === 'Sign Up' ? 'Account created' : 'Login successful'} 🎉`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        setModel(false) // Close the modal after successful login
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <div onClick={close}>
      <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
          <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
          <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book an appointment</p>

          {state === 'Sign Up' && (
            <div className='w-full'>
              <p>Full Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="text"
                required
              />
            </div>
          )}

          <div className='w-full'>
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='border border-[#DADADA] rounded w-full p-2 mt-1'
              type="email"
              required
            />
          </div>

          <div className='w-full'>
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='border border-[#DADADA] rounded w-full p-2 mt-1'
              type="password"
              required
            />
          </div>

          <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>
            {state === 'Sign Up' ? 'Create account' : 'Login'}
          </button>

          {state === 'Sign Up' ? (
            <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
          ) : (
            <p>Create a new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
          )}
        </div>
      </form>
    </div>
  )
}

Login.propTypes = {
  setModel: PropTypes.func.isRequired,
}

export default Login

import React, { useState } from 'react'
import '../../styles/auth.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import login from '../../images/login.png'

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const { token } = useParams()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!password.trim()) return toast.error('Password is required')
        if (password !== confirm) return toast.error('Passwords do not match')
        try {
            await axios.post(`/api/v1/users/reset-password/${token}`, { password })
            toast.success('Password reset successful! Please login.')
            navigate('/login')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.')
        }
    }

    return (
        <div className='marginStyle'>
            <div className="container d-flex justify-content-center align-items-center">
                <div className="row border rounded-5 p-3 bg-white shadow box-area reverseCol">
                    <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
                        <div className="featured-image mb-3 animateImg">
                            <img src={login} className="img-fluid" width={500} alt="reset password" />
                        </div>
                    </div>
                    <div className="col-md-6 right-box">
                        <div className="row align-items-center">
                            <div className="header-text mb-4">
                                <h2>Reset Password</h2>
                                <p>Enter your new password below</p>
                            </div>
                            <div className="input-group d-flex align-items-center mb-3">
                                <div className="form-outline flex-fill mb-0">
                                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control form-control-lg border-dark fs-6" placeholder="New Password" required />
                                </div>
                            </div>
                            <div className="input-group d-flex align-items-center mb-3">
                                <div className="form-outline flex-fill mb-0">
                                    <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" className="form-control form-control-lg border-dark fs-6" placeholder="Confirm Password" required />
                                </div>
                            </div>
                            <div className="d-flex flex-row align-items-center mt-4">
                                <div className="form-outline flex-fill mb-0">
                                    <button className="btn btn-lg text-white" type="button" onClick={handleSubmit} style={{ backgroundColor: 'blueviolet', width: '100%' }}>Reset Password</button>
                                </div>
                            </div>
                            <div className="d-flex flex-row align-items-center my-3">
                                <div className="form-outline flex-fill mb-0">
                                    <Link to='/login' className="btn btn-outline-dark btn-lg btn-block" style={{ width: '100%' }}>Back to Login</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword

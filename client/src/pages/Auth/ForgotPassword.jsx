import React, { useState } from 'react'
import '../../styles/auth.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import login from '../../images/login.png'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email.trim()) return toast.error('Email is required')
        try {
            await axios.post(`/api/v1/users/forgot-password`, { email })
            setSent(true)
            toast.success('Reset link sent to your email')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send reset email')
        }
    }

    return (
        <div className='marginStyle'>
            <div className="container d-flex justify-content-center align-items-center">
                <div className="row border rounded-5 p-3 bg-white shadow box-area reverseCol">
                    <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
                        <div className="featured-image mb-3 animateImg">
                            <img src={login} className="img-fluid" width={500} alt="forgot password" />
                        </div>
                    </div>
                    <div className="col-md-6 right-box">
                        <div className="row align-items-center">
                            <div className="header-text mb-4">
                                <h2>Forgot Password</h2>
                                <p>Enter your email to receive a reset link</p>
                            </div>
                            {sent ? (
                                <div className="alert alert-success">
                                    Reset link sent! Check your inbox and follow the link to reset your password.
                                </div>
                            ) : (
                                <>
                                    <div className="input-group d-flex align-items-center mb-3">
                                        <div className="form-outline flex-fill mb-0">
                                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control form-control-lg border-dark fs-6" placeholder="Email Address" required />
                                        </div>
                                    </div>
                                    <div className="d-flex flex-row align-items-center mt-4">
                                        <div className="form-outline flex-fill mb-0">
                                            <button className="btn btn-lg text-white" type="button" onClick={handleSubmit} style={{ backgroundColor: 'blueviolet', width: '100%' }}>Send Reset Link</button>
                                        </div>
                                    </div>
                                </>
                            )}
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

export default ForgotPassword

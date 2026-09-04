import React, { useEffect, useState } from 'react'
import { BiMenuAltLeft } from 'react-icons/bi'
import logo from '../../images/logo.png'
import { Link } from "react-router-dom"
import toast from 'react-hot-toast'
import '../../styles/navbar.css'
import { useAuth } from '../../context/auth'

const Navbar = () => {
    const [auth, setAuth] = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSubmit = () => {
        setAuth({
            ...auth,
            user: null,
            token: ''
        });
        localStorage.removeItem('auth');
        toast.success('Logged Out Successfully');
        setSidebarOpen(false);
    };

    const menuItems = [
        { to: '/emergency', icon: '🚨', label: 'Emergency' },
        { to: '/', icon: '🏠', label: 'Home' },
        { to: '/about', icon: '👥', label: 'About Us' },
        { to: '/contact', icon: '📞', label: 'Contact Us' },
        { to: '/report', icon: '📝', label: 'Report Incident' },
        { to: '/shake-alert', icon: '📳', label: 'Shake Alert' },
        { to: '/fake-call', icon: '📞', label: 'Simulated Call' },
        { to: '/helpline-numbers', icon: '☎️', label: 'Helpline Numbers' },
        { to: '/police-map', icon: '🚔', label: 'Police Map' },
        { to: '/track-me', icon: '📍', label: 'Track Me' },
        { to: '/safe-route', icon: '🗺️', label: 'Safe Routes' },
        { to: '/night-mode', icon: '🌙', label: 'Night Mode' },
        { to: '/safety-chatbot', icon: '🤖', label: 'AI Assistant' },
        { to: '/location-reminder', icon: '⚠️', label: 'Safety Zones' },
        { to: '/safety-tips', icon: '💡', label: 'Safety Tips' },
        { to: '/safety-quiz', icon: '🎯', label: 'Safety Quiz' },
        { to: '/weather-safety', icon: '🌦️', label: 'Weather Safety' },
        { to: '/feedback', icon: '💬', label: 'Feedback' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector('.header_wrapper');
            if (window.scrollY > 50) {
                header?.classList.add('header-scrolled');
            } else {
                header?.classList.remove('header-scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header className='header_wrapper'>
                <nav className="navbar navbar-expand-lg fixed-top shadow-sm">
                    <div className="container-fluid mx-3 d-flex justify-content-between align-items-center">
                        
                        {/* Left Side: Hamburger Menu Button + Brand Logo */}
                        <div className="d-flex align-items-center gap-3">
                            <button
                                type="button"
                                className="btn hamburger-btn d-flex align-items-center gap-2 px-3 py-2"
                                onClick={() => setSidebarOpen(true)}
                                aria-label="Open Side Menu"
                                title="Open Features Menu"
                            >
                                <BiMenuAltLeft size={26} />
                                <span className="d-none d-md-inline" style={{ fontWeight: 600, fontSize: '15px' }}>
                                    Menu
                                </span>
                            </button>

                            <Link to='/' className="navbar-brand m-0">
                                <img src={logo} alt="Suraksha" style={{ width: '130px' }} />
                            </Link>
                        </div>

                        {/* Center: Desktop Navigation Links */}
                        <div className="collapse navbar-collapse justify-content-center d-none d-lg-flex" id="navbarNav">
                            <ul className="navbar-nav menu-navbar-nav d-flex align-items-center mb-0">
                                <li className="nav-item">
                                    <Link to='/emergency' className="nav-link learn-more-btn-logout text-white" style={{ textDecoration: 'none' }}>
                                        Emergency
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to='/' className="nav-link" style={{ textDecoration: 'none' }}>
                                        Home
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to='/about' className="nav-link" style={{ textDecoration: 'none' }}>
                                        About Us
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to='/contact' className="nav-link" style={{ textDecoration: 'none' }}>
                                        Contact Us
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to='/report' className="nav-link" style={{ textDecoration: 'none' }}>
                                        Report Incident
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Right side: Auth buttons */}
                        <div className="d-flex align-items-center gap-2">
                            {!auth.user ? (
                                <div className="d-flex align-items-center gap-2">
                                    <Link to='/login' className="btn btn-outline-secondary px-3 py-2 rounded-3" style={{ textDecoration: 'none' }}>
                                        Login
                                    </Link>
                                    <Link to='/register' className="btn btn-primary px-3 py-2 rounded-3 text-white" style={{ textDecoration: 'none', backgroundColor: 'blueviolet', borderColor: 'blueviolet' }}>
                                        Register
                                    </Link>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center gap-2">
                                    <Link to="/dashboard/profile" className="btn btn-outline-primary px-3 py-2 rounded-3" style={{ textDecoration: 'none' }}>
                                        Profile
                                    </Link>
                                    <button onClick={handleSubmit} className="btn btn-outline-danger px-3 py-2 rounded-3">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            {/* Backdrop overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 9998,
                        backdropFilter: 'blur(3px)',
                        transition: 'opacity 0.3s ease'
                    }}
                />
            )}

            {/* Sliding Side Menu Drawer (Left Side) */}
            <div
                className="modern-sidebar"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '320px',
                    maxWidth: '85vw',
                    height: '100vh',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.3s ease-in-out',
                    boxShadow: '4px 0 25px rgba(0, 0, 0, 0.3)'
                }}
            >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center border-bottom p-3">
                    <h5 className="mb-0 text-white fw-bold">All Features</h5>
                    <button
                        type="button"
                        className="btn"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Menu items list */}
                <div className="p-3 flex-grow-1" style={{ overflowY: 'auto' }}>
                    <ul className="navbar-nav flex-column mb-0" style={{ listStyle: 'none' }}>
                        {menuItems.map((item) => (
                            <li className="nav-item mb-1" key={item.to}>
                                <Link
                                    to={item.to}
                                    className="nav-link d-flex align-items-center py-2 px-3 text-white rounded-3"
                                    style={{ textDecoration: 'none' }}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="me-3" style={{ fontSize: '20px' }}>{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}

                        <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

                        {/* Auth Links inside Sidebar */}
                        {!auth.user ? (
                            <>
                                <li className="nav-item mb-1">
                                    <Link
                                        to='/login'
                                        className="nav-link d-flex align-items-center py-2 px-3 text-white rounded-3 bg-primary mb-2"
                                        style={{ textDecoration: 'none' }}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="me-3">🔑</span>
                                        <span>Login</span>
                                    </Link>
                                </li>
                                <li className="nav-item mb-1">
                                    <Link
                                        to='/register'
                                        className="nav-link d-flex align-items-center py-2 px-3 text-white rounded-3 bg-success"
                                        style={{ textDecoration: 'none' }}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="me-3">📝</span>
                                        <span>Register</span>
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item mb-1">
                                    <Link
                                        to="/dashboard/profile"
                                        className="nav-link d-flex align-items-center py-2 px-3 text-white rounded-3 bg-info mb-2"
                                        style={{ textDecoration: 'none' }}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="me-3">👤</span>
                                        <span>Profile</span>
                                    </Link>
                                </li>
                                <li className="nav-item mb-1">
                                    <button
                                        onClick={handleSubmit}
                                        className="nav-link d-flex align-items-center py-2 px-3 text-white rounded-3 bg-danger w-100 border-0 text-start"
                                    >
                                        <span className="me-3">🚪</span>
                                        <span>Logout</span>
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;

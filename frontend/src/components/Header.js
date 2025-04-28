import { useContext, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from "../App";
import { useForm } from 'react-hook-form';
import API from "../API";

function Header({ logout }) {
    const { user, httpClient } = useContext(UserContext);
    const { register, setError, formState: { errors }, handleSubmit } = useForm();
    const navigate = useNavigate();
    const location = useLocation();

    const [updatePassword, setUpdatePassword] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const modalCloseBtn = useRef(null);

    const onLogout = () => {
        setIsLoggingOut(true);
        httpClient.post(API.LOGOUT)
            .then(() => {
                logout();
                setIsLoggingOut(false);
                navigate('/login');
            })
            .catch(error => {
                console.error('Logout error:', error);
                setIsLoggingOut(false);
                // Still navigate to login page even if there's an error
                navigate('/login');
            });
    };

    const onUpdate = (data) => {
        if (updatePassword) {
            if (data.currentPassword === data.password) {
                setError('password', { type: 'match' });
                return;
            }

            if (data.password !== data.confirmPassword) {
                setError('confirmPassword', { type: 'not_match' });
                return;
            }
        }

        httpClient.put(API.USER, data)
            .then(() => {
                modalCloseBtn.current.click();
            })
            .catch(error => {
                if (!error.response || error.response.status !== 404) {
                    console.error(error);
                }
                setError('currentPassword', { type: 'incorrect' });
            });
    };

    return (
        <div className="container">
            <header className="d-flex justify-content-between align-items-center py-3">
                <div className="d-flex align-items-center">
                    <Link to="/" className="text-decoration-none">
                        <div className="d-flex align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#1da1f2" className="me-2" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                            </svg>
                            <span className="h2 mb-0 text-white fw-bold">BlogBook</span>
                        </div>
                    </Link>
                </div>

                {user && (
                    <div className="d-flex align-items-center">
                        <ul className="nav nav-pills me-3">
                            <li className="nav-item">
                                <Link 
                                    to="/" 
                                    className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-house me-1" viewBox="0 0 16 16">
                                        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"/>
                                    </svg>
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link 
                                    to="/editPost" 
                                    className={`nav-link ${location.pathname === '/editPost' ? 'active' : ''}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle me-1" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                    </svg>
                                    New Post
                                </Link>
                            </li>
                        </ul>
                        <div className="dropdown">
                            <button className="d-block link-body-emphasis dropdown-toggle bg-transparent border-0" data-bs-toggle="dropdown" aria-expanded="false">
                                {user.username}
                            </button>
                            <ul className="dropdown-menu text-small">
                                <li><button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#editUserModal" onClick={() => setUpdatePassword(false)}>Change username</button></li>
                                <li><button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#editUserModal" onClick={() => setUpdatePassword(true)}>Change password</button></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button 
                                        className="dropdown-item" 
                                        onClick={onLogout}
                                        disabled={isLoggingOut}
                                    >
                                        {isLoggingOut ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                                                Logging out...
                                            </>
                                        ) : (
                                            'Logout'
                                        )}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </header>

            {/* Edit User Modal */}
            <div className="modal fade" id="editUserModal" tabIndex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editUserModalLabel">{updatePassword ? 'Change Password' : 'Change Username'}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onUpdate)}>
                                {updatePassword && (
                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                                            id="currentPassword"
                                            placeholder="Current Password"
                                            {...register('currentPassword', { required: true })}
                                        />
                                        <label htmlFor="currentPassword">Current Password</label>
                                        {errors.currentPassword && (
                                            <div className="invalid-feedback">
                                                {errors.currentPassword.type === 'incorrect' ? 'Current password is incorrect' : 'Current password is required'}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="form-floating mb-3">
                                    <input
                                        type={updatePassword ? 'password' : 'text'}
                                        className={`form-control ${errors[updatePassword ? 'password' : 'username'] ? 'is-invalid' : ''}`}
                                        id={updatePassword ? 'password' : 'username'}
                                        placeholder={updatePassword ? 'New Password' : 'New Username'}
                                        {...register(updatePassword ? 'password' : 'username', { required: true })}
                                    />
                                    <label htmlFor={updatePassword ? 'password' : 'username'}>{updatePassword ? 'New Password' : 'New Username'}</label>
                                    {errors[updatePassword ? 'password' : 'username'] && (
                                        <div className="invalid-feedback">
                                            {errors[updatePassword ? 'password' : 'username'].type === 'match' ? 'New password must be different from current password' : `${updatePassword ? 'New password' : 'New username'} is required`}
                                        </div>
                                    )}
                                </div>
                                {updatePassword && (
                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                            id="confirmPassword"
                                            placeholder="Confirm New Password"
                                            {...register('confirmPassword', { required: true })}
                                        />
                                        <label htmlFor="confirmPassword">Confirm New Password</label>
                                        {errors.confirmPassword && (
                                            <div className="invalid-feedback">
                                                {errors.confirmPassword.type === 'not_match' ? 'Passwords do not match' : 'Please confirm your new password'}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary" type="submit">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
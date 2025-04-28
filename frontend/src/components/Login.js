import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../App";
import { useForm } from 'react-hook-form';
import Loading from './Loading';
import API from '../API';

function Login({ getUser }) {
    const { user, httpClient, isSessionExpired, logout } = useContext(UserContext);
    const { register, setError, formState: { errors }, handleSubmit, reset } = useForm();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState('');
    const loginForm = useRef(null);

    useEffect(() => {
        setIsLoading(true);
        if (!user) {
            setIsLoading(false);
            return;
        }
        isSessionExpired()
            .then(expired => {
                if (expired) {
                    logout();
                    setIsLoading(false);
                    return;
                }
                navigate('/');
            });
    }, [isSessionExpired, logout, navigate, user]);

    const onLogin = (data) => {
        setIsLoggingIn(true);
        setLoginError('');

        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('password', data.password);

        httpClient.post(API.LOGIN, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true
        })
            .then(response => {
                if (response.status === 200 || response.status === 302) {
                    getUser();
                    setIsLoggingIn(false);
                    reset();
                    navigate('/');
                }
            })
            .catch((error) => {
                setIsLoggingIn(false);
                if (error.response) {
                    if (error.response.status === 404 || error.response.status === 401) {
                        setLoginError('Invalid username or password');
                    } else {
                        setLoginError('An error occurred. Please try again.');
                    }
                } else {
                    setLoginError('Network error. Please check your connection.');
                }
            });
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="container">
            <div className="row justify-content-center align-items-center min-vh-100">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow-lg border-0 rounded-lg">
                        <div className="card-header text-center py-4">
                            <h3 className="mb-0">Welcome to BlogBook</h3>
                        </div>
                        <div className="card-body p-4">
                            <div className="text-center mb-4">
                                <a href="/signup" className="text-decoration-none">Don't have an account? Sign up</a>
                            </div>
                            {loginError && (
                                <div className="alert alert-danger" role="alert">
                                    {loginError}
                                </div>
                            )}
                            <form ref={loginForm} onSubmit={handleSubmit(onLogin)}>
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                        id="username"
                                        placeholder="Username"
                                        {...register('username', { required: true })}
                                    />
                                    <label htmlFor="username">Username</label>
                                    {errors.username && (
                                        <div className="invalid-feedback">
                                            Username is required
                                        </div>
                                    )}
                                </div>
                                <div className="form-floating mb-3">
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        placeholder="Password"
                                        {...register('password', { required: true })}
                                    />
                                    <label htmlFor="password">Password</label>
                                    {errors.password && (
                                        <div className="invalid-feedback">Password is required</div>
                                    )}
                                </div>
                                <div className="d-grid gap-2">
                                    {isLoggingIn ? (
                                        <button className="btn btn-primary btn-lg" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                                            Logging in...
                                        </button>
                                    ) : (
                                        <button className="btn btn-primary btn-lg" type="submit">
                                            Log in
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
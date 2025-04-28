import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../App"
import { useForm } from 'react-hook-form';
import Loading from './Loading';
import API from '../API';

function SignUp() {
    const { user, httpClient, isSessionExpired, logout } = useContext(UserContext);
    const { register, setError, formState: { errors }, handleSubmit } = useForm();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isSigningUp, setIsSigningUp] = useState(false);

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

    const onSignUp = (data) => {
        if (data.password !== data.confirmPassword) {
            setError('confirmPassword', { type: 'not_match' });
            return;
        }

        setIsSigningUp(true);
        httpClient.post(API.SIGNUP, data)
            .then(() => {
                setIsSigningUp(false);
                if (window.history.length > 2) {
                    navigate(-1);
                } else {
                    navigate('/');
                }
            })
            .catch((error) => {
                if (!error.response || error.response.status !== 409) {
                    console.error(error);
                }
                setError('username', { type: 'exists' });
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
                            <h3 className="mb-0">Create your account</h3>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit(onSignUp)}>
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
                                            {errors.username.type === 'exists' ? 'Username already exists' : 'Username is required'}
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
                                <div className="form-floating mb-3">
                                    <input
                                        type="password"
                                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                        id="confirmPassword"
                                        placeholder="Confirm Password"
                                        {...register('confirmPassword', { required: true })}
                                    />
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    {errors.confirmPassword && (
                                        <div className="invalid-feedback">
                                            {errors.confirmPassword.type === 'not_match' ? 'Passwords do not match' : 'Please confirm your password'}
                                        </div>
                                    )}
                                </div>
                                <div className="d-grid gap-2">
                                    {isSigningUp ? (
                                        <button className="btn btn-primary btn-lg" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                                            Creating account...
                                        </button>
                                    ) : (
                                        <button className="btn btn-primary btn-lg" type="submit">
                                            Sign up
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                        <div className="card-footer text-center py-3">
                            <div className="small">
                                <a href="/login" className="text-decoration-none">Already have an account? Log in</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
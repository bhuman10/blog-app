import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from "../App";
import { useForm } from 'react-hook-form';
import Loading from './Loading';
import API from '../API';

function EditPost() {
    const { user, httpClient } = useContext(UserContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const fileInput = useRef(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tags, setTags] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [postData, setPostData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [existingImage, setExistingImage] = useState(null);

    const { register, setError, formState: { errors }, handleSubmit, reset } = useForm();

    useEffect(() => {
        setIsLoading(true);
        httpClient.get(API.TAG)
            .then(response => {
                setTags(response.data);
                setIsLoading(false);
            })
            .catch(error => console.error(error));

        if (id) {
            httpClient.get(`${API.POST}/${id}`)
                .then(response => {
                    const post = response.data;
                    setPostData(post);
                    setSelectedTags(post.tags.map(tag => tag.id));
                    if (post.image) {
                        setExistingImage(post.image);
                        setPreviewImage(`${API.FILES}/${post.image}`);
                    }
                    reset({
                        title: post.title,
                        content: post.content
                    });
                    setIsLoading(false);
                })
                .catch(error => {
                    if (!error.response || error.response.status !== 404) {
                        console.error(error);
                    }
                    navigate('/');
                });
        } else {
            setIsLoading(false);
        }
    }, [httpClient, id, navigate, reset]);

    const onTagClick = (tagId) => {
        setSelectedTags(prev => {
            if (prev.includes(tagId)) {
                return prev.filter(id => id !== tagId);
            } else {
                return [...prev, tagId];
            }
        });
    };

    const onImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = (data) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        
        // Send selected tag IDs as a comma-separated string
        if (selectedTags.length > 0) {
            formData.append('tags', selectedTags.join(','));
        }
        
        // Handle image upload
        if (selectedFile) {
            formData.append('image', selectedFile);
        } else if (existingImage) {
            // For existing images, we need to send a Blob
            fetch(`${API.FILES}/${existingImage}`)
                .then(response => response.blob())
                .then(blob => {
                    formData.append('image', blob, existingImage);
                    submitForm(formData);
                })
                .catch(error => {
                    console.error('Error fetching existing image:', error);
                    submitForm(formData);
                });
        } else {
            submitForm(formData);
        }
    };

    const submitForm = (formData) => {
        const request = id
            ? httpClient.put(`${API.POST}/${id}`, formData)
            : httpClient.post(API.POST, formData);

        request
            .then(() => {
                setIsSubmitting(false);
                navigate('/');
            })
            .catch(error => {
                setIsSubmitting(false);
                if (!error.response || error.response.status !== 409) {
                    console.error(error);
                }
                setError('title', { type: 'exists' });
            });
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm border-0 rounded-lg bg-dark text-white">
                        <div className="card-header">
                            <h3 className="mb-0">{id ? 'Edit Post' : 'Create New Post'}</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-4">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className={`form-control bg-dark text-white ${errors.title ? 'is-invalid' : ''}`}
                                        id="title"
                                        placeholder="Enter post title"
                                        {...register('title', { required: true })}
                                    />
                                    {errors.title && (
                                        <div className="invalid-feedback">
                                            {errors.title.type === 'exists' ? 'A post with this title already exists' : 'Title is required'}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="content" className="form-label">Content</label>
                                    <textarea
                                        className={`form-control bg-dark text-white ${errors.content ? 'is-invalid' : ''}`}
                                        id="content"
                                        rows="6"
                                        placeholder="Write your post content here..."
                                        {...register('content', { required: true })}
                                    ></textarea>
                                    {errors.content && (
                                        <div className="invalid-feedback">Content is required</div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Tags</label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {tags && tags.map(tag => (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                className={`btn btn-sm ${selectedTags.includes(tag.id) ? 'btn-primary' : 'btn-outline-primary'}`}
                                                onClick={() => onTagClick(tag.id)}
                                            >
                                                {tag.name}
                                            </button>
                                        ))}
                                    </div>
                                    <small className="text-white-50 mt-2 d-block">
                                        Selected tags: {selectedTags.length > 0 ? selectedTags.map(id => tags.find(t => t.id === id)?.name).join(', ') : 'None'}
                                    </small>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="image" className="form-label">Image</label>
                                    <input
                                        type="file"
                                        className="form-control bg-dark text-white"
                                        id="image"
                                        accept="image/*"
                                        ref={fileInput}
                                        onChange={onImageChange}
                                    />
                                    {previewImage && (
                                        <div className="mt-3">
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="img-fluid rounded"
                                                style={{ maxHeight: '300px' }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="d-grid gap-2">
                                    {isSubmitting ? (
                                        <button className="btn btn-primary btn-lg" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                                            {id ? 'Updating...' : 'Creating...'}
                                        </button>
                                    ) : (
                                        <button className="btn btn-primary btn-lg" type="submit">
                                            {id ? 'Update Post' : 'Create Post'}
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

export default EditPost;

import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from "../App"
import API from '../API';

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function PostList({ posts, setSelectedPost, deletePost }) {
    const { user } = useContext(UserContext);

    if (!posts || posts.length === 0) {
        return (
            <div className="text-center py-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-journal-text text-white mb-3" viewBox="0 0 16 16">
                    <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                    <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                    <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                </svg>
                <h4 className="text-white">No posts found</h4>
                <p className="text-white-50">Try adjusting your search or filters</p>
            </div>
        );
    }

    return (
        <div className="list-group">
            {posts.map(post => (
                <div key={post.id} className="list-group-item list-group-item-action p-0 border-0 mb-3">
                    <div className="card border-0 bg-dark shadow-sm">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                            {post.user.username.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="mb-0 text-white fw-bold">{post.user.username}</h5>
                                        <small className="text-white-50">@{post.user.username.toLowerCase()}</small>
                                    </div>
                                </div>
                                {user && user.id === post.user.id && (
                                    <div className="btn-group">
                                        <Link to={`/editPost/${post.id}`} className="btn btn-sm btn-outline-light">
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <button 
                                            type="button" 
                                            className="btn btn-sm btn-outline-danger" 
                                            data-bs-toggle="modal" 
                                            data-bs-target="#deletePostModal" 
                                            onClick={() => setSelectedPost(post)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <Link to={`/viewPost/${post.id}`} className="text-decoration-none">
                                <h4 className="text-white fw-bold mb-3">{post.title}</h4>
                                
                                {post.image && (
                                    <div className="mb-3">
                                        <img 
                                            className="img-fluid rounded" 
                                            src={`${API.FILES}/${post.image}`} 
                                            alt={post.title}
                                            style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                                
                                <p className="text-white mb-3">
                                    {post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}
                                </p>
                            </Link>
                            
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                {post.tags.map(tag => (
                                    <Link 
                                        key={tag.id} 
                                        to={`/?tag=${tag.id}`} 
                                        className="badge bg-primary text-white text-decoration-none border"
                                    >
                                        #{tag.name}
                                    </Link>
                                ))}
                            </div>
                            
                            <div className="d-flex justify-content-between align-items-center">
                                <small className="text-white-50">
                                    <i className="bi bi-clock me-1"></i>
                                    {formatDate(post.createdAt)}
                                </small>
                                <div className="d-flex gap-3">
                                    <small className="text-white-50"><i className="bi bi-chat me-1"></i> 0</small>
                                    <small className="text-white-50"><i className="bi bi-heart me-1"></i> 0</small>
                                    <small className="text-white-50"><i className="bi bi-share me-1"></i> 0</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PostList;
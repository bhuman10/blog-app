import { useState, useContext, useEffect, useCallback } from 'react';
import { UserContext } from "../App"
import API from '../API';
import PostList from './PostList';
import TagList from './TagList';
import Loading from './Loading';

function Home() {
    const { httpClient } = useContext(UserContext);
    const [posts, setPosts] = useState(null);
    const [tags, setTags] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [tagId, setTagId] = useState(0);
    const [isTagsLoading, setIsTagsLoading] = useState(true);

    useEffect(() => {
        getTags();
    }, []);

    // get post list
    const getPosts = useCallback(() => {
        setPosts(null);
        httpClient.get(API.POST, { params: { search, tagId, page } })
            .then((response) => setPosts(response.data))
            .catch((error) => console.error(error));
    }, [search, tagId, page, httpClient]);

    // get all tags
    const getTags = () => {
        setIsTagsLoading(true);
        httpClient.get(API.TAG)
            .then((response) => {
                setTags(response.data);
                setIsTagsLoading(false);
            })
            .catch((error) => console.error(error));
    };

    // delete post
    const deletePost = (id) => {
        httpClient.delete(`${API.POST}/${id}`)
            .then(() => {
                getPosts();
                getTags();
            })
            .catch(error => console.error(error));
    }

    // handle search bar submit
    const handleSearchSubmit = event => {
        event.preventDefault();
        const searchInput = event.target.elements.search;
        setSearch(searchInput.value);
    };

    useEffect(() => {
        getPosts();
    }, [getPosts]);

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8">
                    <div className="card shadow-sm border-0 rounded-lg mb-4">
                        <div className="card-body">
                            <form onSubmit={handleSearchSubmit} className="mb-4">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search posts..."
                                        name="search"
                                        defaultValue={search}
                                    />
                                    <button className="btn btn-primary" type="submit">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                        </svg>
                                    </button>
                                </div>
                            </form>

                            {posts && posts.list.length === 0 && (
                                <div className="text-center py-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-journal-text text-muted mb-3" viewBox="0 0 16 16">
                                        <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                                        <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                                        <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                                    </svg>
                                    <h4 className="text-muted">No posts found</h4>
                                    <p className="text-muted">Try adjusting your search or filters</p>
                                </div>
                            )}

                            {posts && posts.list.length > 0 && (
                                <PostList posts={posts.list} deletePost={deletePost} />
                            )}

                            {posts && posts.list.length > 0 && (
                                <div className="d-flex justify-content-center mt-4">
                                    <nav>
                                        <ul className="pagination">
                                            <li className={`page-item ${!posts.hasPreviousPage ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => setPage(posts.prePage)} disabled={!posts.hasPreviousPage}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                                    </svg>
                                                </button>
                                            </li>
                                            {Array.from({ length: posts.pages }, (_, i) => i + 1).map(i => (
                                                <li key={i} className={`page-item ${posts.pageNum === i ? 'active' : ''}`}>
                                                    <button className="page-link" onClick={() => setPage(i)}>{i}</button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${!posts.hasNextPage ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => setPage(posts.nextPage)} disabled={!posts.hasNextPage}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                                    </svg>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 rounded-lg">
                        <div className="card-header">
                            <h5 className="mb-0">Popular Tags</h5>
                        </div>
                        <div className="card-body">
                            {isTagsLoading ? (
                                <Loading />
                            ) : (
                                <TagList tags={tags} setTagId={setTagId} selectedTagId={tagId} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
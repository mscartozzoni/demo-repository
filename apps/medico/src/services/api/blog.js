import { handleApiError } from './utils';

let mockPosts = [
    { id: 'post-1', title: 'Benefícios da Rinoplastia', content: 'Conteúdo sobre rinoplastia...', created_at: new Date().toISOString(), author: { full_name: 'Dr. Márcio', avatar_url: '' } },
    { id: 'post-2', title: 'Recuperação Pós-Lipoaspiração', content: 'Dicas para uma recuperação mais rápida...', created_at: new Date().toISOString(), author: { full_name: 'Dr. Márcio', avatar_url: '' } },
];
let nextPostId = 3;

export const getPosts = async () => {
    console.warn("getPosts is using mock data.");
    return new Promise(resolve => setTimeout(() => resolve({ success: true, data: mockPosts }), 500));
};

export const addPost = async (postData) => {
    console.warn("addPost is using mock data.");
    const newPost = {
        id: `post-${nextPostId++}`,
        ...postData,
        created_at: new Date().toISOString(),
        author: { full_name: 'Dr. Márcio', avatar_url: '' } // Assuming current user is the author
    };
    mockPosts.unshift(newPost);
    return new Promise(resolve => setTimeout(() => resolve({ success: true, data: newPost }), 300));
};

export const updatePost = async (postId, postData) => {
    console.warn("updatePost is using mock data.");
    let postUpdated = null;
    mockPosts = mockPosts.map(p => {
        if (p.id === postId) {
            postUpdated = { ...p, ...postData };
            return postUpdated;
        }
        return p;
    });
    if (postUpdated) {
        return new Promise(resolve => setTimeout(() => resolve({ success: true, data: postUpdated }), 300));
    }
    return handleApiError({ message: 'Post not found' }, 'updatePost');
};

export const deletePost = async (postId) => {
    console.warn("deletePost is using mock data.");
    const initialLength = mockPosts.length;
    mockPosts = mockPosts.filter(p => p.id !== postId);
    if (mockPosts.length < initialLength) {
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 300));
    }
    return handleApiError({ message: 'Post not found' }, 'deletePost');
};
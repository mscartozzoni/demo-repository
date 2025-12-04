import React, { useState, useEffect, useCallback } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Pencil1Icon, PlusIcon, Share1Icon, PersonIcon } from '@radix-ui/react-icons';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { getPosts, addPost, updatePost, deletePost } from '@/services/api/blog';
    import { sendNewsletter } from '@/services/api/communication.js';
    import BlogPostModal from '@/components/blog/BlogPostModal';
    import NewsletterModal from '@/components/blog/NewsletterModal';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

    const Blog = () => {
      const { toast } = useToast();
      const [posts, setPosts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [isPostModalOpen, setPostModalOpen] = useState(false);
      const [isNewsletterModalOpen, setNewsletterModalOpen] = useState(false);
      const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);
      const [selectedPost, setSelectedPost] = useState(null);

      const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
          const response = await getPosts();
          if (response.success) {
            setPosts(response.data);
          } else {
            throw new Error(response.error.message);
          }
        } catch (error) {
          toast({ variant: 'destructive', title: 'Erro ao buscar posts', description: error.message });
        } finally {
          setLoading(false);
        }
      }, [toast]);

      useEffect(() => {
        fetchPosts();
      }, [fetchPosts]);

      const handleSavePost = async (postData) => {
        try {
          if (selectedPost) {
            await updatePost(selectedPost.id, postData);
            toast({ title: 'Post atualizado com sucesso!', className: 'bg-green-600 text-white' });
          } else {
            await addPost(postData);
            toast({ title: 'Post criado com sucesso!', className: 'bg-green-600 text-white' });
          }
          setPostModalOpen(false);
          setSelectedPost(null);
          fetchPosts();
        } catch (error) {
          toast({ variant: 'destructive', title: 'Erro ao salvar post', description: error.message });
        }
      };

      const handleDeletePost = async (postId) => {
        try {
          await deletePost(postId);
          toast({ title: 'Post excluído com sucesso!', className: 'bg-yellow-500 text-white' });
          fetchPosts();
        } catch (error) {
          toast({ variant: 'destructive', title: 'Erro ao excluir post', description: error.message });
        }
      };

      const openPostModal = (post = null) => {
        setSelectedPost(post);
        setPostModalOpen(true);
      };
      
      const openNewsletterModal = (post) => {
        setSelectedPost(post);
        setNewsletterModalOpen(true);
      };
      
      const handleSendNewsletter = async () => {
        if (!selectedPost) return;
        setIsSendingNewsletter(true);
        try {
          await sendNewsletter(selectedPost);
          toast({
            title: 'Newsletter enviada!',
            description: `O post "${selectedPost.title}" foi enviado para os assinantes.`,
            className: 'bg-green-600 text-white'
          });
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Erro ao enviar Newsletter',
            description: error.message
          });
        } finally {
          setIsSendingNewsletter(false);
          setNewsletterModalOpen(false);
          setSelectedPost(null);
        }
      };

      return (
        <>
          <Helmet>
            <title>Blog - Portal do Médico</title>
            <meta name="description" content="Gerencie os posts do seu blog." />
          </Helmet>
          
          <BlogPostModal
            isOpen={isPostModalOpen}
            onClose={() => { setPostModalOpen(false); setSelectedPost(null); }}
            onSave={handleSavePost}
            post={selectedPost}
          />

          <NewsletterModal
            isOpen={isNewsletterModalOpen}
            onClose={() => setNewsletterModalOpen(false)}
            post={selectedPost}
            onConfirm={handleSendNewsletter}
            isSending={isSendingNewsletter}
          />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Blog</h1>
                <p className="text-slate-400 mt-2">Crie e gerencie conteúdo para seus pacientes.</p>
              </div>
              <Button onClick={() => openPostModal()} className="bg-blue-600 hover:bg-blue-700">
                <PlusIcon className="w-4 h-4 mr-2" /> Novo Post
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <p className="text-slate-400 col-span-full text-center">Carregando posts...</p>
              ) : (
                posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-effect rounded-xl overflow-hidden flex flex-col"
                  >
                    <img class="w-full h-48 object-cover" alt={post.title} src="https://images.unsplash.com/photo-1615336523094-d786dac51efd" />
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold text-white mb-2 flex-grow">{post.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={post.author?.avatar_url} />
                          <AvatarFallback>
                            <PersonIcon />
                          </AvatarFallback>
                        </Avatar>
                        <span>{post.author?.full_name || 'Autor Desconhecido'}</span>
                        <span>•</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-auto">
                        <Button variant="outline" size="sm" onClick={() => openPostModal(post)}>
                          <Pencil1Icon className="w-3 h-3 mr-1" /> Editar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openNewsletterModal(post)}>
                          <Share1Icon className="w-3 h-3 mr-1" /> Enviar Newsletter
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

             {!loading && posts.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 col-span-full"
                >
                    <div className="glass-effect rounded-xl p-8 max-w-md mx-auto">
                    <Pencil1Icon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Nenhum post encontrado</h3>
                    <p className="text-slate-400 mb-4">
                        Clique em "Novo Post" para começar a criar seu conteúdo.
                    </p>
                    </div>
                </motion.div>
            )}

          </div>
        </>
      );
    };

    export default Blog;
'use client';

import { useState } from 'react';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Modal from '@/components/Modal';
import DashboardLayout from '@/components/DashboardLayout';
import { useArticles } from '@/hooks/useArticles';
import FormInput from '@/components/FormInput';
import FormTextarea from '@/components/FormTextarea';
import ImageUploadInput from '@/components/ImageUploadInput';
import ConfirmModal from '@/components/ConfirmModal';
import { toast } from 'react-hot-toast';

interface ArticleImage {
  id: number;
  url: string;
  order: number;
}

interface Article {
  id: number;
  title: string;
  body: string;
  images: ArticleImage[];
  createdAt: string;
  updatedAt: string;
}

export default function ArticlesPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    body: '', 
    images: [] as string[] 
  });

  const { articles, addArticle, editArticle, deleteArticle } = useArticles();

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
      return;
    }

    if (!formData.body.trim()) {
      toast.error('Le corps de l\'article est requis');
      return;
    }

    // Filter out empty image URLs
    const validImages = formData.images.filter(url => url.trim() !== '');

    try {
      await addArticle({
        title: formData.title,
        body: formData.body,
        images: validImages.map((url, index) => ({ 
          url, 
          order: index 
        }))
      }, () => {
        setIsCreateModalOpen(false);
        setFormData({ title: '', body: '', images: [] });
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      toast.error('Impossible de créer l\'article');
    }
  };

  const handleEditArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle) return;

    // Validate input
    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
      return;
    }

    if (!formData.body.trim()) {
      toast.error('Le corps de l\'article est requis');
      return;
    }

    // Filter out empty image URLs
    const validImages = formData.images.filter(url => url.trim() !== '');

    try {
      await editArticle({
        id: selectedArticle.id,
        title: formData.title,
        body: formData.body,
        images: validImages.map((url, index) => ({ 
          url, 
          order: index 
        }))
      }, () => {
        setIsEditModalOpen(false);
        setFormData({ title: '', body: '', images: [] });
      });
    } catch (error) {
      console.error('Erreur lors de la modification de l\'article:', error);
      toast.error('Impossible de modifier l\'article');
    }
  };

  const handleDeleteArticle = async () => {
    if (!selectedArticle) return;
    await deleteArticle(selectedArticle.id, () => {
      setIsDeleteModalOpen(false);
    });
  };

  const openEditModal = (article: Article) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      body: article.body,
      images: article.images.map(img => img.url)
    });
    setIsEditModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-[2000px] mx-auto">
        <div className="mb-6">
          <button
            onClick={() => {
              setFormData({ title: '', body: '', images: [] });
              setIsCreateModalOpen(true);
            }}
            className="btn btn-primary btn-sm"
          >
            <MdAdd className="mr-2" /> Ajouter un article
          </button>
        </div>

        {/* Articles Grid with Image Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
          {articles.map((article) => (
            <div key={article.id} className="card bg-base-100 shadow-xl">
              <figure className="h-48 overflow-hidden">
                {article.images.length > 0 ? (
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={10}
                  slidesPerView={1}
                  navigation={true}
                  loop={article.images.length > 1}
                  className="w-full h-48 object-cover"
                >
                  {article.images.map((image, index) => (
                    <SwiperSlide key={image.id || index}>
                      <img 
                        src={image.url}
                        alt={`${article.title} - Image ${index + 1}`} 
                        className="w-full h-48 object-cover" 
                  />
                    </SwiperSlide>
                  ))}
                </Swiper>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    Pas d'image
                  </div>
                )}
              </figure>
              <div className="card-body p-4">
                <h2 className="card-title text-base line-clamp-2">{article.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-3">{article.body}</p>
                <div className="card-actions justify-end mt-2">
                  <button 
                    onClick={() => openEditModal(article)}
                    className="btn btn-sm btn-ghost"
                  >
                    <MdEdit className="text-xl text-blue-500" />
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedArticle(article);
                      setIsDeleteModalOpen(true);
                    }}
                    className="btn btn-sm btn-ghost"
                  >
                    <MdDelete className="text-xl text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Article Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Créer un article</h2>
              <form onSubmit={handleCreateArticle}>
                <FormInput
                  label="Titre"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <FormTextarea
                  label="Corps"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  required
                />
                <ImageUploadInput
                  images={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                  maxImages={5}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-ghost" 
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setFormData({ title: '', body: '', images: [] });
                    }}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-sm btn-primary">
                    Créer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Article Modal */}
        {isEditModalOpen && selectedArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Modifier l'article</h2>
              <form onSubmit={handleEditArticle}>
                <FormInput
                  label="Titre"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <FormTextarea
                  label="Corps"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  required
                />
                <ImageUploadInput
                  images={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                  maxImages={5}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-ghost" 
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setFormData({ title: '', body: '', images: [] });
                    }}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-sm btn-primary">
                    Modifier
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Article Modal */}
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteArticle}
          title="Supprimer l'article"
          message="Êtes-vous sûr de vouloir supprimer cet article ?"
        />
      </div>
    </DashboardLayout>
  );
}

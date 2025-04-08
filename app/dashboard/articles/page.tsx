"use client";

import { useState } from 'react';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Modal from '@/components/Modal';
import DashboardLayout from '@/components/DashboardLayout';
import { useArticles } from '@/hooks/useArticles';

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
  const [formData, setFormData] = useState({ title: '', body: '', images: [''] });

  const { articles, addArticle, editArticle, deleteArticle } = useArticles();

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    await addArticle(formData, () => {
      setIsCreateModalOpen(false);
      setFormData({ title: '', body: '', images: [''] });
    });
  };

  const handleEditArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle) return;

    await editArticle({
      ...formData,
      id: selectedArticle.id
    }, () => {
      setIsEditModalOpen(false);
    });
  };

  const handleDeleteArticle = async () => {
    if (!selectedArticle) return;

    await deleteArticle(selectedArticle.id, () => {
      setIsDeleteModalOpen(false);
    });
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-[2000px] mx-auto">
        <div className="mb-6">
          <button
            onClick={() => {
              setFormData({ title: '', body: '', images: [''] });
              setIsCreateModalOpen(true);
            }}
            className="btn btn-primary btn-sm"
          >
            <MdAdd className="text-xl" />
            Nouvel article
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="card card-compact bg-base-100 shadow-xl w-full">
              <Swiper
                modules={[Autoplay, Navigation]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                navigation
                loop
                className="w-full h-32"
              >
                {article.images.map((image, index) => (
                  <SwiperSlide key={image.id}>
                    <img
                      src={image.url}
                      alt={`${article.title} - Image ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="card-body">
                <h3 className="card-title text-base">{article.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{article.body}</p>
                <div className="card-actions justify-end mt-2">
                  <button
                    onClick={() => {
                      setSelectedArticle(article);
                      setFormData({
                        title: article.title,
                        body: article.body,
                        images: article.images.map((image) => image.url)
                      });
                      setIsEditModalOpen(true);
                    }}
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

        {/* Modal de création */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Nouvel article"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input input-bordered input-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contenu</label>
              <textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="textarea textarea-bordered min-h-[150px] w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Images (max 5)</label>
              {formData.images.map((url, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                      const newImages = [...formData.images];
                      newImages[index] = e.target.value;
                      setFormData({ ...formData, images: newImages });
                    }}
                    className="input input-bordered input-sm flex-1"
                    placeholder={`URL de l'image ${index + 1}`}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = formData.images.filter((_, i) => i !== index);
                        setFormData({ ...formData, images: newImages });
                      }}
                      className="btn btn-sm btn-error"
                    >
                      <MdDelete />
                    </button>
                  )}
                </div>
              ))}
              {formData.images.length < 5 && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                  className="btn btn-sm btn-secondary mt-2"
                >
                  <MdAdd /> Ajouter une image
                </button>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="btn btn-sm btn-ghost"
              >
                Annuler
              </button>
              <button type="submit" onClick={handleCreateArticle} className="btn btn-sm btn-primary">
                Créer
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal de modification */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Modifier l'article"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input input-bordered input-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contenu</label>
              <textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="textarea textarea-bordered min-h-[150px] w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Images (max 5)</label>
              {formData.images.map((url, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                      const newImages = [...formData.images];
                      newImages[index] = e.target.value;
                      setFormData({ ...formData, images: newImages });
                    }}
                    className="input input-bordered input-sm flex-1"
                    placeholder={`URL de l'image ${index + 1}`}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = formData.images.filter((_, i) => i !== index);
                        setFormData({ ...formData, images: newImages });
                      }}
                      className="btn btn-sm btn-error"
                    >
                      <MdDelete />
                    </button>
                  )}
                </div>
              ))}
              {formData.images.length < 5 && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                  className="btn btn-sm btn-secondary mt-2"
                >
                  <MdAdd /> Ajouter une image
                </button>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-sm btn-ghost"
              >
                Annuler
              </button>
              <button type="submit" onClick={handleEditArticle} className="btn btn-sm btn-primary">
                Modifier
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal de suppression */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Supprimer l'article"
        >
          <p>Êtes-vous sûr de vouloir supprimer cet article ?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn btn-sm btn-ghost"
            >
              Annuler
            </button>
            <button className="btn btn-sm btn-error" onClick={handleDeleteArticle}>
                Supprimer
              </button>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

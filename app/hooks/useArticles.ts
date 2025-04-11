import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { successNotification, errorNotification } from '../components/Notification';

export function useArticles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des articles');
      }
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      toast.error(error.message, errorNotification(error.message));
    }
  };

  const addArticle = async (newArticle, callback) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création de l\'article');
      }

      toast.success('Article créé avec succès !', successNotification('Article créé avec succès !'));
      await fetchArticles();
      callback?.();
    } catch (error) {
      toast.error(error.message, errorNotification(error.message || 'Erreur lors de la création de l\'article'));
    }
  };

  const editArticle = async (updatedArticle, callback) => {
    try {
      const response = await fetch(`/api/articles/${updatedArticle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedArticle),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la modification de l\'article');
      }

      toast.success('Article modifié avec succès !', successNotification('Article modifié avec succès !'));
      await fetchArticles();
      callback?.();
    } catch (error) {
      toast.error(error.message, errorNotification(error.message || 'Erreur lors de la modification de l\'article'));
    }
  };

  const deleteArticle = async (articleId, callback) => {
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la suppression de l\'article');
      }

      toast.success('Article supprimé avec succès !', successNotification('Article supprimé avec succès !'));
      await fetchArticles();
      callback?.();
    } catch (error) {
      toast.error(error.message, errorNotification(error.message || 'Erreur lors de la suppression de l\'article'));
    }
  };

  return {
    articles,
    fetchArticles,
    addArticle,
    editArticle,
    deleteArticle,
  };
}
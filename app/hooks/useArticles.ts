import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

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
      toast.error('Erreur lors du chargement des articles', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#F9F9F9',
          color: 'black',
        },
      });
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
        throw new Error('Erreur lors de la création de l\'article');
      }

      toast.success('Article créé avec succès !', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#F9F9F9',
          color: 'black',
        },
      });
      await fetchArticles();
      callback?.();
    } catch (error) {
      toast.error('Erreur lors de la création de l\'article', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#F9F9F9',
          color: 'black',
        },
      });
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
        throw new Error('Erreur lors de la modification de l\'article');
      }

      toast.success('Article modifié avec succès !', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#F9F9F9',
          color: 'black',
        },
      });
      await fetchArticles();
      callback?.();
    } catch (error) {
      toast.error('Erreur lors de la modification de l\'article', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#F9F9F9',
          color: 'black',
        },
      });
    }
  };

  const deleteArticle = async (articleId, callback) => {
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'article');
      }

      toast.success('Article supprimé avec succès !', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#F9F9F9  ',
          color: 'black',
        },
      });
      await fetchArticles();
      callback?.();
    } catch (error) {
      toast.error('Erreur lors de la suppression de l\'article', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#F9F9F9',
          color: 'black',
        },
      });
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
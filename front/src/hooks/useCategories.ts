import { useState, useEffect } from 'react';
import { Category } from '@shared/types';
import { getCategories } from 'services/categories';

const useCategories = (): Category[] | null => {
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      const res = await getCategories();
      setCategories(res.data);
    };
    initialize();
  }, []);

  return categories;
};

export default useCategories;

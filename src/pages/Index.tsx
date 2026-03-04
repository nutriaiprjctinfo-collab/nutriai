import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '@/lib/storage';

const Index = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(getSession() ? '/dashboard' : '/login');
  }, [navigate]);
  return null;
};

export default Index;

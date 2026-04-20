import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';

function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate('/login');
      return;
    }

    handleOAuthCallback(token).then(() => navigate('/dashboard'));
  }, [searchParams, handleOAuthCallback, navigate]);

  return <LoadingSpinner label="Completing authentication..." />;
}

export default AuthCallbackPage;

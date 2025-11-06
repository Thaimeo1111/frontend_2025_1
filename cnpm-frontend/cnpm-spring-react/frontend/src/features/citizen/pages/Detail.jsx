import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CitizenForm } from '../components/CitizenForm';
import citizenApi from '../../../api/citizenApi';
import Loader from '../../../components/Loader';
import ErrorMessage from '../../../components/ErrorMessage';
import useApiHandler from '../../../hooks/useApiHandler';

const CitizenDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: citizen,
    loading,
    error,
    handleApi
  } = useApiHandler(null);

  const fetchCitizen = async () => {
    if (id === 'new') return;
    await handleApi(
      () => citizenApi.getById(id),
      'Không thể tải thông tin nhân khẩu'
    );
  };

  useEffect(() => {
    fetchCitizen();
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      await handleApi(
        () => id === 'new' ? citizenApi.create(data) : citizenApi.update(id, data),
        'Không thể lưu thông tin nhân khẩu'
      );
      navigate('/citizen');
    } catch (err) {
      // Error handled by hook
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCitizen} />;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Chi tiết nhân khẩu</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <CitizenForm 
          citizen={citizen}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CitizenDetail;
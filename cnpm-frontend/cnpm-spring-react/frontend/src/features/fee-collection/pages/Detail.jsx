import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FeeCollectionForm } from '../components/FeeCollectionForm';
import feeCollectionApi from '../../../api/feeCollectionApi';
import Loader from '../../../components/Loader';
import ErrorMessage from '../../../components/ErrorMessage';
import useApiHandler from '../../../hooks/useApiHandler';

const FeeCollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: collection,
    loading,
    error,
    handleApi
  } = useApiHandler(null);

  const fetchCollection = async () => {
    if (id === 'new') return;
    await handleApi(
      () => feeCollectionApi.getById(id),
      'Không thể tải thông tin thu phí'
    );
  };

  useEffect(() => {
    fetchCollection();
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      await handleApi(
        () => id === 'new' ? feeCollectionApi.create(data) : feeCollectionApi.update(id, data),
        'Không thể lưu thu phí'
      );
      navigate('/fee-collection');
    } catch (err) {}
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCollection} />;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {id === 'new' ? 'Thêm thu phí mới' : 'Chi tiết thu phí'}
        </h1>
        <button
          onClick={() => navigate('/fee-collection')}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Quay lại
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <FeeCollectionForm
          initialValues={collection || {}}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default FeeCollectionDetail;
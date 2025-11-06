import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  maHoKhau: yup.string().required('Vui lòng nhập mã hộ khẩu'),
  chuHo: yup.string().required('Vui lòng nhập tên chủ hộ'),
  diaChi: yup.string().required('Vui lòng nhập địa chỉ'),
  ghiChu: yup.string()
});

export const HouseholdForm = ({ initialValues, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Mã hộ khẩu
        </label>
        <input
          type="text"
          {...register('maHoKhau')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.maHoKhau && (
          <p className="mt-1 text-sm text-red-600">{errors.maHoKhau.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Chủ hộ
        </label>
        <input
          type="text"
          {...register('chuHo')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.chuHo && (
          <p className="mt-1 text-sm text-red-600">{errors.chuHo.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Địa chỉ
        </label>
        <textarea
          {...register('diaChi')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.diaChi && (
          <p className="mt-1 text-sm text-red-600">{errors.diaChi.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Ghi chú
        </label>
        <textarea
          {...register('ghiChu')}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
};
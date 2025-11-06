import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormInput from '../../../components/Form/FormInput';
import FormSelect from '../../../components/Form/FormSelect';

const schema = yup.object().shape({
  hoTen: yup.string().required('Vui lòng nhập họ tên'),
  ngaySinh: yup.date().required('Vui lòng nhập ngày sinh'),
  gioiTinh: yup.string().required('Vui lòng chọn giới tính'),
  cccd: yup.string()
    .matches(/^\d{12}$/, 'CCCD phải có 12 chữ số')
    .required('Vui lòng nhập CCCD'),
  trangThai: yup.string().required('Vui lòng chọn trạng thái')
});

const genderOptions = [
  { value: 'Nam', label: 'Nam' },
  { value: 'Nữ', label: 'Nữ' }
];

const statusOptions = [
  { value: 'THUONG_TRU', label: 'Thường trú' },
  { value: 'TAM_TRU', label: 'Tạm trú' },
  { value: 'TAM_VANG', label: 'Tạm vắng' }
];

export const CitizenForm = ({ initialValues, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Họ và tên"
        register={register}
        name="hoTen"
        error={errors.hoTen}
      />

      <FormInput
        label="Ngày sinh"
        type="date"
        register={register}
        name="ngaySinh"
        error={errors.ngaySinh}
      />

      <FormSelect
        label="Giới tính"
        register={register}
        name="gioiTinh"
        options={genderOptions}
        error={errors.gioiTinh}
      />

      <FormInput
        label="CCCD"
        register={register}
        name="cccd"
        error={errors.cccd}
      />

      <FormSelect
        label="Trạng thái"
        register={register}
        name="trangThai"
        options={statusOptions}
        error={errors.trangThai}
      />

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
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextInput } from '@gravity-ui/uikit';
import { toaster } from '@gravity-ui/uikit/toaster-singleton-react-18';
import '@styles/Sign.less';
import { useUpdateUserMutation } from '@services/ConduitAPI.js';
import { setAuth } from '@store/authSlice.js';

export default function EditProfile() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  // Заполнение формы текущими данными пользователя
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        avatar: user.avatar || '',
        newPassword: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async data => {
    try {
      // Подготовка данных для отправки (если пароль пустой, не отправляем его)
      const payload = {
        username: data.username,
        email: data.email,
        avatar: data.avatar || null,
        ...(data.newPassword && { password: data.newPassword }),
      };

      const response = await updateUser(payload).unwrap();
      dispatch(setAuth({ user: response.user, token: response.user.token }));

      // eslint-disable-next-line no-undef
      localStorage.setItem(
        'auth',
        JSON.stringify({ token: response.user.token, user: response.user }),
      );

      toaster.add({
        title: 'Успешно!',
        content: 'Профиль обновлен.',
        theme: 'success',
      });
    } catch (error) {
      toaster.add({
        title: 'Ошибка!',
        content: 'Не удалось обновить профиль. Проверьте данные.',
        theme: 'danger',
      });
    }
  };

  return (
    <form className="edit-profile" onSubmit={handleSubmit(onSubmit)}>
      <h1>Редактировать профиль</h1>

      {/* Username */}
      <Controller
        name="username"
        control={control}
        defaultValue=""
        rules={{
          required: 'Имя пользователя обязательно',
        }}
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Имя пользователя"
            note={field.value ? 'Имя пользователя' : undefined}
            error={!!errors.username}
            errorMessage={errors.username?.message || ''}
          />
        )}
      />

      {/* Email */}
      <Controller
        name="email"
        control={control}
        defaultValue=""
        rules={{
          required: 'Email обязателен',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Некорректный email',
          },
        }}
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Email"
            note={field.value ? 'Email' : undefined}
            type="email"
            error={!!errors.email}
            errorMessage={errors.email?.message || ''}
          />
        )}
      />

      {/* New Password */}
      <Controller
        name="newPassword"
        control={control}
        defaultValue=""
        rules={{
          minLength: {
            value: 6,
            message: 'Пароль должен быть не менее 6 символов',
          },
          maxLength: {
            value: 40,
            message: 'Пароль должен быть не более 40 символов',
          },
        }}
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Новый пароль"
            note={field.value ? 'Новый пароль' : undefined}
            type="password"
            error={!!errors.newPassword}
            errorMessage={errors.newPassword?.message || ''}
          />
        )}
      />

      {/* Avatar URL */}
      <Controller
        name="avatar"
        control={control}
        defaultValue=""
        rules={{
          pattern: {
            value:
              /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:[0-9]{1,5})?(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
            message: 'Некорректный URL изображения',
          },
        }}
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="URL аватара"
            note={field.value ? 'URL аватара' : undefined}
            error={!!errors.avatar}
            errorMessage={errors.avatar?.message || ''}
          />
        )}
      />

      {/* Submit */}
      <section className="button-area">
        <Button
          className="update-button"
          type="submit"
          size="l"
          view="action"
          disabled={Object.keys(errors).length > 0}
        >
          Обновить профиль
        </Button>
      </section>
    </form>
  );
}

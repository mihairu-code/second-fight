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

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        image: user.image || '',
        newPassword: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async data => {
    try {
      const payload = {
        username: data.username,
        email: data.email,
        image: data.image || null,
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

  const renderInput = (
    name,
    placeholder,
    type = 'text',
    validation = {},
    defaultValue = '',
  ) => (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={validation}
      render={({ field }) => {
        const hasError = !!errors[name] && field.value !== '';
        return (
          <TextInput
            {...field}
            placeholder={hasError ? undefined : placeholder}
            note={!hasError && field.value ? placeholder : undefined}
            type={type}
            error={hasError}
            errorMessage={hasError ? errors[name]?.message : ''}
          />
        );
      }}
    />
  );

  return (
    <form className="edit-profile" onSubmit={handleSubmit(onSubmit)}>
      <h1>Редактировать профиль</h1>

      {renderInput(
        'username',
        'Имя пользователя',
        'text',
        {
          required: 'Имя пользователя обязательно',
        },
        user?.username || '',
      )}

      {renderInput(
        'email',
        'Email',
        'email',
        {
          required: 'Email обязателен',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Некорректный email',
          },
        },
        user?.email || '',
      )}

      {renderInput('newPassword', 'Новый пароль', 'password', {
        minLength: {
          value: 6,
          message: 'Пароль должен быть не менее 6 символов',
        },
        maxLength: {
          value: 40,
          message: 'Пароль должен быть не более 40 символов',
        },
      })}

      {renderInput(
        'avatar',
        'URL аватара',
        'text',
        {
          pattern: {
            value:
              /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:[0-9]{1,5})?(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
            message: 'Некорректный URL изображения',
          },
        },
        user?.image || '',
      )}

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

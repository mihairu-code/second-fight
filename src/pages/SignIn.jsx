import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextInput } from '@gravity-ui/uikit';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '@services/ConduitAPI'; // Хук для входа в систему
import { setAuth } from '@store/store.js'; // Действие для установки аутентификации
import '@styles/Sign.less';
import { Link, useNavigate } from 'react-router';
import { toaster } from '@gravity-ui/uikit/toaster-singleton-react-18';

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginMutation(); // Хук для входа пользователя

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange', // Включаем валидацию на каждом изменении
  });

  const onSubmit = async data => {
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      }).unwrap();

      // eslint-disable-next-line no-undef
      localStorage.setItem(
        'auth',
        JSON.stringify({
          token: response.user.token,
          user: response.user,
        }),
      );

      // Сохраняем токен и данные о пользователе в Redux
      dispatch(
        setAuth({
          token: response.user.token,
          user: response.user,
        }),
      );

      // Перенаправляем пользователя на главную страницу
      navigate('/'); // или на нужную страницу после входа
    } catch (error) {
      let errorMessage = 'Неизвестная ошибка';

      if (error.data?.errors) {
        if (typeof error.data.errors === 'object') {
          // Обработка объекта ошибок
          errorMessage = Object.entries(error.data.errors)
            .map(([key, value]) =>
              Array.isArray(value)
                ? `${key}: ${value.join(', ')}`
                : `${key}: ${value}`,
            )
            .join('\n');
        } else {
          // Если errors — это строка или другой тип
          errorMessage = String(error.data.errors);
        }
      }

      toaster.add({
        title: 'Ошибка входа',
        message: errorMessage,
        type: 'error',
      });
    }
  };

  return (
    <form className="sign-in" onSubmit={handleSubmit(onSubmit)}>
      <h1>Вход</h1>

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
            note={field.value ? 'Email' : undefined} // Отображаем label, если есть значение
            type="email"
            error={!!errors.email && field.value !== ''}
            errorMessage={field.value !== '' ? errors.email?.message : ''}
          />
        )}
      />

      {/* Password */}
      <Controller
        name="password"
        control={control}
        defaultValue=""
        rules={{
          required: 'Пароль обязателен',
        }}
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Пароль"
            note={field.value ? 'Пароль' : undefined}
            type="password"
            error={!!errors.password && field.value !== ''}
            errorMessage={field.value !== '' ? errors.password?.message : ''}
          />
        )}
      />

      {/* Submit */}
      <section className="button-area">
        <Button
          className="login-button"
          type="submit"
          size="l"
          view="action"
          disabled={isLoading || Object.keys(errors).length > 0}
        >
          Войти
        </Button>
        <span>
          Нет аккаунта? <Link to="/sign-up">Регистрация</Link>.
        </span>
      </section>
    </form>
  );
}

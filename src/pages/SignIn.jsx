import React, { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextInput } from '@gravity-ui/uikit';
import { Link, useNavigate } from 'react-router';
import { toaster } from '@gravity-ui/uikit/toaster-singleton-react-18';
import { ConduitAPI, useLoginMutation } from '@services/ConduitAPI';
import { useDispatch } from 'react-redux';
import { setAuth } from '@store/authSlice.js';
import '@styles/Sign.less';

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const showToast = useCallback((name, title, content, theme = 'danger') => {
    toaster.add({ name, title, content, theme, autoHiding: 5000 });
  }, []);

  const onSubmit = async data => {
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      }).unwrap();

      // eslint-disable-next-line no-undef
      localStorage.setItem(
        'auth',
        JSON.stringify({ token: response.user.token, user: response.user }),
      );

      dispatch(setAuth({ token: response.user.token, user: response.user }));
      dispatch(ConduitAPI.util.invalidateTags(['Articles', 'Article']));

      showToast(
        'login-success',
        'Успешный вход',
        'Вы успешно вошли!',
        'success',
      );

      navigate('/articles');
    } catch (error) {
      if (error?.data?.errors) {
        if (error.data.errors['email or password']) {
          setError('email', {
            type: 'server',
            message: 'Логин или пароль некорректен',
          });
          setError('password', {
            type: 'server',
            message: 'Логин или пароль некорректен',
          });
        } else {
          Object.entries(error.data.errors).forEach(([key, message]) => {
            setError(key, { type: 'server', message });
          });
        }
      } else {
        setError('email', {
          type: 'server',
          message: 'Ошибка сервера, попробуйте позже',
        });
        setError('password', {
          type: 'server',
          message: 'Ошибка сервера, попробуйте позже',
        });
      }
    }
  };

  const renderInput = (name, placeholder, type = 'text', validation = {}) => (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={validation}
      render={({ field }) => {
        const hasError = !!errors[name] && field.value !== '';
        return (
          <TextInput
            {...field}
            placeholder={placeholder}
            note={field.value ? placeholder : undefined}
            type={type}
            error={hasError}
            errorMessage={hasError ? errors[name]?.message : ''}
          />
        );
      }}
    />
  );

  return (
    <form className="sign-in" onSubmit={handleSubmit(onSubmit)}>
      <h1>Вход</h1>

      {renderInput('email', 'Email', 'email', {
        required: 'Email обязателен',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Некорректный email',
        },
      })}
      {renderInput('password', 'Пароль', 'password', {
        required: 'Пароль обязателен',
      })}
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

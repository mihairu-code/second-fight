import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Checkbox, TextInput } from '@gravity-ui/uikit';
import { toaster } from '@gravity-ui/uikit/toaster-singleton-react-18';
import { useRegisterUserMutation } from '@services/ConduitAPI';
import { useDispatch } from 'react-redux';
import { setAuth } from '@store/store.js';
import '@styles/Sign.less';
import { Link, useNavigate } from 'react-router';

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'onChange',
  });

  const password = watch('password', '');
  const consent = watch('consent', false);

  const onSubmit = async data => {
    if (!consent) {
      toaster.add({
        name: 'consent-error',
        title: 'Ошибка',
        content: 'Необходимо согласие с обработкой персональных данных',
        theme: 'danger',
        autoHiding: 5000,
      });
      return;
    }

    try {
      const response = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      }).unwrap();

      dispatch(
        setAuth({
          token: response.user.token,
          user: response.user,
        }),
      );

      toaster.add({
        name: 'registration-success',
        title: 'Успешно!',
        content: 'Вы успешно зарегистрированы!',
        theme: 'success',
        autoHiding: 5000,
      });

      navigate('/sign-in');
    } catch (error) {
      toaster.add({
        name: 'registration-error',
        title: 'Ошибка регистрации',
        content: error.data?.errors
          ? Object.entries(error.data.errors)
              .map(([key, value]) => `${key}: ${value.join(', ')}`)
              .join('\n')
          : 'Неизвестная ошибка',
        theme: 'danger',
        autoHiding: 5000,
      });
    }
  };

  return (
    <form className="sign-up" onSubmit={handleSubmit(onSubmit)}>
      <h1>Регистрация</h1>

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
            error={!!errors.email && field.value !== ''}
            errorMessage={field.value !== '' ? errors.email?.message : ''}
          />
        )}
      />

      {/* Username */}
      <Controller
        name="username"
        control={control}
        defaultValue=""
        rules={{
          required: 'Имя пользователя обязательно',
          minLength: {
            value: 3,
            message: 'Введите не менее 3 символов',
          },
          maxLength: {
            value: 20,
            message: 'Введите не более 20 символов',
          },
        }}
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Имя пользователя"
            note={field.value ? 'Имя пользователя' : undefined}
            error={!!errors.username && field.value !== ''}
            errorMessage={field.value !== '' ? errors.username?.message : ''}
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
            placeholder="Пароль"
            note={field.value ? 'Пароль' : undefined}
            type="password"
            error={!!errors.password && field.value !== ''}
            errorMessage={field.value !== '' ? errors.password?.message : ''}
          />
        )}
      />

      {/* Repeat Password */}
      <Controller
        name="repeatPassword"
        control={control}
        defaultValue=""
        rules={{
          required: 'Повтор пароля обязателен',
          validate: value => value === password || 'Пароли должны совпадать',
        }}
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Повторите пароль"
            note={field.value ? 'Повторите пароль' : undefined}
            type="password"
            error={!!errors.repeatPassword && field.value !== ''}
            errorMessage={
              field.value !== '' ? errors.repeatPassword?.message : ''
            }
          />
        )}
      />

      {/* Consent */}
      <Controller
        name="consent"
        control={control}
        defaultValue={false}
        rules={{
          required: 'Необходимо согласие с обработкой персональных данных',
        }}
        render={({ field }) => (
          <Checkbox
            className="checkbox"
            {...field}
            checked={field.value}
            onChange={e => field.onChange(e.target.checked)}
          >
            Я согласен на обработку персональных данных
          </Checkbox>
        )}
      />

      {/* Submit */}
      <section className="button-area">
        <Button
          className="create-button"
          type="submit"
          size="l"
          view="action"
          disabled={isLoading || Object.keys(errors).length > 0}
        >
          Зарегистрироваться
        </Button>
        <span>
          Уже есть аккаунт? <Link to="/sign-in">Войти</Link>.
        </span>
      </section>
    </form>
  );
}

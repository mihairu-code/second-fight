import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Checkbox, TextInput } from '@gravity-ui/uikit';
import { toaster } from '@gravity-ui/uikit/toaster-singleton-react-18';
import { useRegisterUserMutation } from '@services/ConduitAPI';
import { Link, useNavigate } from 'react-router';
import '@styles/Sign.less';

export default function SignUp() {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm({ mode: 'onChange' });

  const password = watch('password', '');
  const consent = watch('consent', false);

  const showToast = useCallback((name, title, content, theme = 'danger') => {
    toaster.add({ name, title, content, theme, autoHiding: 5000 });
  }, []);

  const onSubmit = async data => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!consent) {
      showToast(
        'consent-error',
        'Ошибка',
        'Необходимо согласие с обработкой персональных данных',
      );
      return;
    }

    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      }).unwrap();

      showToast(
        'registration-success',
        'Успешно!',
        'Вы успешно зарегистрированы!',
        'success',
      );
      navigate('/sign-in');
    } catch (error) {
      if (error?.data?.errors) {
        Object.entries(error.data.errors).forEach(([key, message]) => {
          if (message === 'is invalid') {
            const keyRU =
              // eslint-disable-next-line no-nested-ternary
              key === 'email'
                ? 'Адрес'
                : key === 'password'
                  ? 'Пароль'
                  : 'Никнейм';
            const errorMessage = `${keyRU} некорректен`;
            setError(key, { type: 'server', message: errorMessage });
          } else {
            message = 'уже занят';
            const keyRU = key === 'email' ? 'адрес' : 'никнейм';
            const errorMessage = `Такой ${keyRU} ${message}`;
            setError(key, { type: 'server', message: errorMessage });
          }
        });
      }
    } finally {
      setIsSubmitting(false);
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
    <form className="sign-up" onSubmit={handleSubmit(onSubmit)}>
      <h1>Регистрация</h1>
      {renderInput('email', 'Email', 'email', {
        required: 'Email обязателен',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Некорректный email',
        },
      })}
      {renderInput('username', 'Имя пользователя', 'text', {
        required: 'Имя пользователя обязательно',
        minLength: { value: 3, message: 'Введите не менее 3 символов' },
        maxLength: { value: 20, message: 'Введите не более 20 символов' },
      })}
      {renderInput('password', 'Пароль', 'password', {
        required: 'Пароль обязателен',
        minLength: {
          value: 6,
          message: 'Пароль должен быть не менее 6 символов',
        },
        maxLength: {
          value: 40,
          message: 'Пароль должен быть не более 40 символов',
        },
      })}
      {renderInput('repeatPassword', 'Повторите пароль', 'password', {
        required: 'Повтор пароля обязателен',
        validate: value => value === password || 'Пароли должны совпадать',
      })}
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

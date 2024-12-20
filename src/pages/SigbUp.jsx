import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Button, Checkbox, Toaster } from '@gravity-ui/uikit';
import '@styles/Sign.less';

export default function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'onChange', // Включаем валидацию на каждом изменении
  });

  const password = watch('password', ''); // Для проверки совпадения паролей
  const consent = watch('consent', false); // Проверка состояния чекбокса

  const onSubmit = data => {
    if (!consent) {
      Toaster.add({
        title: 'Ошибка',
        message: 'Необходимо согласие с обработкой персональных данных',
        type: 'error',
      });
      return;
    }
    console.log('Registration Data: ', data);
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
            note={field.value ? 'Email' : undefined} // Отображаем label, если есть значение
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
      <Button
        className="create-button"
        type="submit"
        size="l"
        view="action"
        disabled={Object.keys(errors).length > 0}
      >
        Зарегистрироваться
      </Button>
    </form>
  );
}

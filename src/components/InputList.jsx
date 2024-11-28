import { TextInput } from '@gravity-ui/uikit';
import React, { useState } from 'react';
import '@/styles/InputList.less';

export default function InputList({ user }) {
  const typeOfInputs = {
    new: [
      {
        name: 'Username',
        type: 'text',
        placeholder: 'Username',
        errorMessage: 'Username is required.',
      },
      {
        name: 'Email Address',
        type: 'email',
        placeholder: 'Email Address',
        errorMessage: 'Invalid email format.',
      },
      {
        name: 'Password',
        type: 'password',
        placeholder: 'Password',
        errorMessage: 'Password must be at least 6 characters.',
      },
      {
        name: 'Repeat Password',
        type: 'password',
        placeholder: 'Repeat Password',
        errorMessage: 'Passwords must match.',
      },
    ],
    login: [
      {
        name: 'Email Address',
        type: 'email',
        placeholder: 'Email Address',
        errorMessage: 'User with this email is not found.',
      },
      {
        name: 'Password',
        type: 'password',
        placeholder: 'Password',
        errorMessage: 'Wrong password.',
      },
    ],
    edit: [
      {
        name: 'Username',
        type: 'text',
        placeholder: 'Username',
        errorMessage: 'Username must be from 4 to 8 letters',
      },
      {
        name: 'Email Address',
        type: 'email',
        placeholder: 'Email Address',
        errorMessage: 'Invalid email format.',
      },
      {
        name: 'New password',
        type: 'password',
        placeholder: 'New password',
        errorMessage: 'Password must not be same with last',
      },
      {
        name: 'Avatar image(url)',
        type: 'url',
        placeholder: 'Avatar image',
        errorMessage: 'Invalid URL format.',
      },
    ],
  };
  const inputs = typeOfInputs[user];

  const [placeholders, setPlaceholders] = useState(
    inputs.map(input => input.placeholder),
  );
  const [notes, setNotes] = useState({}); // Для управления note
  const [values, setValues] = useState(inputs.map(() => '')); // Для хранения введённых значений

  const handleFocus = (index, name) => {
    setPlaceholders(prev => prev.map((p, i) => (i === index ? '' : p))); // Убираем placeholder
    setNotes(prevNotes => ({ ...prevNotes, [index]: name })); // Устанавливаем note
  };

  const handleBlur = index => {
    setPlaceholders(prev =>
      prev.map((p, i) =>
        i === index && !values[index] ? inputs[index].placeholder : p,
      ),
    );

    // Убираем note, только если поле пустое
    setNotes(prevNotes => ({
      ...prevNotes,
      [index]: values[index] ? prevNotes[index] : '',
    }));
  };

  const handleChange = (index, value) => {
    // Обновляем значение инпута
    setValues(prevValues =>
      prevValues.map((v, i) => (i === index ? value : v)),
    );
  };

  return (
    <section className="imputs">
      {inputs.map((input, index) => (
        <TextInput
          type={input.type}
          key={index}
          size="l"
          placeholder={placeholders[index]}
          errorPlacement="inside"
          errorMessage={input.errorMessage}
          validationState=""
          name="input"
          note={<span className="notes-text">{notes[index] || ''}</span>}
          onFocus={() => handleFocus(index, input.name)}
          onBlur={() => handleBlur(index)}
          onChange={e => handleChange(index, e.target.value)} // Отслеживаем изменения
        />
      ))}
    </section>
  );
}

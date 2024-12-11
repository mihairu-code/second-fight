import React, { useState } from 'react';

import { TextInput } from '@gravity-ui/uikit';

import '@/styles/InputList.less';

export default function InputList({ user, onInputChange }) {
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

  return (
    <section className="imputs">
      {inputs.map((input, index) => (
        <TextInput
          type={input.type}
          key={index}
          size="l"
          placeholder={input.placeholder}
          errorPlacement="inside"
          errorMessage={input.errorMessage}
          validationState=""
          name="input"
          onChange={e => onInputChange(index, e.target.value)}
        />
      ))}
    </section>
  );
}

import '../styles/Sign.less';
import { Button } from '@gravity-ui/uikit';
import InputList from '@components/InputList.jsx';
import { useLoginMutation } from '@services/ConduitAPI';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { logout } from '@store/authSlice';

export function SignIn() {
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (index, value) => {
    const keys = ['email', 'password'];
    setFormData(prev => ({ ...prev, [keys[index]]: value }));
  };

  const handleSubmit = async () => {
    const response = await login({
      email: formData.email,
      password: formData.password,
    }).unwrap();
    navigate('/'); // Перенаправление на главную страницу
  };

  return (
    <article className="sign-in">
      <h1>Sign In</h1>
      <InputList user={'login'} onInputChange={handleInputChange} />
      <Button
        className="create-button"
        view="flat"
        size="xl"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        Log In
      </Button>
      {error && (
        <div className="error-message">
          {error.data?.errors?.body?.join(', ')}
        </div>
      )}
    </article>
  );
}

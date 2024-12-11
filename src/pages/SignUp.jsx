import '../styles/Sign.less';
import { Button, Checkbox } from '@gravity-ui/uikit';
import InputList from '@components/InputList.jsx';
import { useSignUpMutation } from '@services/ConduitAPI';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function SignUp() {
  const [signUp, { isLoading, error }] = useSignUpMutation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const [agree, setAgree] = useState(false);

  const handleInputChange = (index, value) => {
    const keys = ['username', 'email', 'password', 'repeatPassword'];
    setFormData(prev => ({ ...prev, [keys[index]]: value }));
  };

  const handleSubmit = async () => {
    await signUp({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    }).unwrap();
    navigate('/sign-in'); // Перенаправление на страницу входа
  };

  return (
    <article className="sign-up">
      <h1>Create new account</h1>
      <InputList user={'new'} onInputChange={handleInputChange} />
      <img className="separate-line" src="src/assets/line.svg" alt="line" />
      <Checkbox
        className="checkbox"
        content="I agree to the processing of my personal information"
        size="l"
        checked={agree}
        onChange={e => setAgree(e.target.checked)}
      />
      <Button
        className="create-button"
        view="flat"
        size="xl"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        Create
      </Button>
      {error && (
        <div className="error-message">
          {error.data?.errors?.body?.join(', ')}
        </div>
      )}
    </article>
  );
}

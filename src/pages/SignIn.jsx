import '../styles/Sign.less';
import { Button } from '@gravity-ui/uikit';
import InputList from '@components/InputList.jsx';

export function SignIn() {
  return (
    <article className="sign-in">
      <h1>Sign In</h1>
      <InputList user={'login'} />
      <Button className="create-button" view="flat" size="xl">
        Login
      </Button>
    </article>
  );
}

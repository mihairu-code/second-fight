import '../styles/Sign.less';
import { Button, Checkbox } from '@gravity-ui/uikit';
import InputList from '@components/InputList.jsx';

export function SignUp() {
  return (
    <article className="sign-up">
      <h1>Create new account</h1>
      <InputList user={'new'} />
      <img className="separate-line" src={'src/assets/line.svg'} alt="line" />
      <Checkbox
        className="checkbox"
        content="I agree to the processing of my personal information"
        size="l"
      />
      <Button className="create-button" view="flat" size="xl">
        Create
      </Button>
    </article>
  );
}

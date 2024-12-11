import '../styles/Sign.less';
import { Button } from '@gravity-ui/uikit';
import InputList from '@components/InputList.jsx';

export default function EditProfile() {
  return (
    <article className="edit-profile">
      <h1>Edit Profile</h1>
      <InputList user={'edit'} />
      <Button className="create-button" view="flat" size="xl" onClick="">
        Save
      </Button>
    </article>
  );
}

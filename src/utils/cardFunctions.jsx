import { Label } from '@gravity-ui/uikit';

const randomColorTags = tag => {
  const colors = [
    'utility',
    'success',
    'info',
    'warning',
    'unknown',
    'danger',
    'normal',
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const formatDate = dateUp =>
  new Date(dateUp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const capitalizeFirstLetter = str => {
  return str ? str[0].toUpperCase() + str.slice(1) : 'No title';
};

const renderTags = (tags = [], componentName = 'ArticleCard') => {
  if (!Array.isArray(tags)) return null;
  const additionalClass =
    componentName === 'OpenedArticle' ? 'tag-list__opened' : '';
  return (
    <ul
      className={`tag-list ${additionalClass}`}
      style={tags.length && { overflow: 'unset' }}
    >
      {tags.map(
        (tag, index) =>
          tag && (
            <li key={index}>
              <Label className="tag" theme={randomColorTags(tag)}>
                {tag[0]?.toUpperCase() + tag.slice(1)}
              </Label>
            </li>
          ),
      )}
    </ul>
  );
};

const setArticleFormValues = (data, setValue, setTags) => {
  if (data) {
    const { title, description, body, tagList } = data.article;
    setValue('title', title);
    setValue('description', description);
    setValue('text', body);
    setTags(tagList);
  }
};

const handleTagUpdate = (
  getValues,
  tags,
  setTags,
  setValue,
  editIndex,
  setEditIndex,
) => {
  const newTag = getValues('tag').trim();
  if (!newTag || newTag.length > 12) return;

  if (editIndex !== null) {
    const updatedTags = [...tags];
    updatedTags[editIndex] = newTag;
    setTags(updatedTags);
    setEditIndex(null);
  } else {
    // eslint-disable-next-line no-lonely-if
    if (!tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
  }

  setValue('tag', '');
};

const removeTag = (index, tags, setTags, editIndex, setEditIndex) => {
  setTags(tags.filter((_, i) => i !== index));
  if (editIndex === index) setEditIndex(null);
};

const editTag = (index, tags, setValue, setEditIndex) => {
  setValue('tag', tags[index]);
  setEditIndex(index);
};

export {
  formatDate,
  randomColorTags,
  capitalizeFirstLetter,
  renderTags,
  removeTag,
  setArticleFormValues,
  handleTagUpdate,
  editTag,
};

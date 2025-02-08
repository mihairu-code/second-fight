import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  Card,
  Icon,
  Label,
  TextArea,
  TextInput,
} from '@gravity-ui/uikit';
import { Pencil, SquarePlus } from '@gravity-ui/icons';
import { useCreateArticleMutation } from '@services/ConduitAPI';
import { useNavigate } from 'react-router';
import { editTag, handleTagUpdate, removeTag } from '@utils/cardFunctions';
import '@styles/Sign.less';

export default function CreateArticle() {
  const navigate = useNavigate();
  const [createArticle, { isLoading }] = useCreateArticleMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    mode: 'onChange',
    defaultValues: { title: '', description: '', text: '', tag: '' },
  });

  const [tags, setTags] = React.useState([]);
  const [editIndex, setEditIndex] = React.useState(null);

  const onSubmit = async data => {
    const { title, description, text } = data;

    try {
      const response = await createArticle({
        title,
        description,
        body: text,
        tagList: tags,
      }).unwrap();
      const slug = response.article.slug;
      navigate(`/articles/${slug}`);
    } catch (error) {
      return <Card children={error} />;
    }
  };

  return (
    <form className="create-article" onSubmit={handleSubmit(onSubmit)}>
      <h1>Создать статью</h1>
      <Controller
        name="title"
        control={control}
        rules={{ required: 'Заголовок обязателен' }}
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Заголовок"
            note={field.value ? 'Заголовок' : undefined}
            error={!!errors.title}
            errorMessage={errors.title?.message}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        rules={{ required: 'Краткое описание обязательно' }}
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Краткое описание"
            note={field.value ? 'Краткое описание' : undefined}
            error={!!errors.description}
            errorMessage={errors.description?.message}
          />
        )}
      />
      <Controller
        name="text"
        control={control}
        rules={{ required: 'Текст статьи обязателен' }}
        render={({ field }) => (
          <TextArea
            {...field}
            placeholder="Текст статьи"
            note={field.value ? 'Текст статьи' : undefined}
            error={!!errors.text}
            errorMessage={errors.text?.message}
            rows={10}
          />
        )}
      />
      <section className="tags-section">
        <Controller
          name="tag"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextInput
              {...field}
              placeholder="Добавить тег"
              note={field.value ? 'Тег' : undefined}
              error={!!errors.tag}
              errorMessage={errors.tag?.message}
            />
          )}
        />
        <Button
          type="button"
          onClick={() =>
            handleTagUpdate(
              getValues,
              tags,
              setTags,
              setValue,
              editIndex,
              setEditIndex,
            )
          }
          size="m"
          view="flat"
        >
          <Icon size={20} data={editIndex !== null ? Pencil : SquarePlus} />
        </Button>
        <div className="tags-list">
          {Array.isArray(tags) && tags.length > 0 ? (
            tags.map((tag, index) => (
              <Label
                key={index}
                type="close"
                onClick={() => editTag(index, tags, setValue, setEditIndex)}
                onCloseClick={() =>
                  removeTag(index, tags, setTags, editIndex, setEditIndex)
                }
              >
                {tag}
              </Label>
            ))
          ) : (
            <p className="tags-placeholder">Добавьте теги</p>
          )}
        </div>
      </section>
      <Button type="submit" size="l" view="action" disabled={isLoading}>
        {isLoading ? 'Создание...' : 'Создать статью'}
      </Button>
    </form>
  );
}

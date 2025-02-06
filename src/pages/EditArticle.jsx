import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Icon, Label, TextArea, TextInput } from '@gravity-ui/uikit';
import { Pencil, SquarePlus } from '@gravity-ui/icons';
import {
  useGetArticleBySlugQuery,
  useUpdateArticleMutation,
} from '@services/ConduitAPI';
import { useNavigate, useParams } from 'react-router';
import {
  editTag,
  handleTagUpdate,
  removeTag,
  setArticleFormValues,
  submitArticleUpdate,
} from '@utils/cardFunctions.jsx';
import '@styles/Sign.less';

export default function EditArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetArticleBySlugQuery(slug);
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
  const [tags, setTags] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      text: '',
      tag: '',
    },
  });

  useEffect(() => {
    setArticleFormValues(data, setValue, setTags);
  }, [data, setValue]);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  const onSubmit = async formData => {
    await submitArticleUpdate(formData, slug, tags, updateArticle, navigate);
  };

  return (
    <form className="create-article" onSubmit={handleSubmit(onSubmit)}>
      <h1>Редактировать статью</h1>
      <Controller
        name="title"
        control={control}
        rules={{ required: 'Заголовок обязателен' }}
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Заголовок"
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
          render={({ field }) => (
            <TextInput {...field} placeholder="Добавить тег" />
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
          {tags.map((tag, index) => (
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
          ))}
        </div>
      </section>

      <Button type="submit" size="l" view="action" disabled={isUpdating}>
        {isUpdating ? 'Обновление...' : 'Обновить статью'}
      </Button>
    </form>
  );
}

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
import { useDispatch } from 'react-redux';

export default function EditArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, error, isLoading, refetch } = useGetArticleBySlugQuery(slug);
  const [
    updateArticle,
    { isLoading: isUpdating, isError, error: updateError },
  ] = useUpdateArticleMutation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm({ mode: 'onChange' });

  const [tags, setTags] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    setArticleFormValues(data, setValue, setTags);
  }, [data, setValue]);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка при загрузке статьи: {error.message}</div>;
  if (isError && updateError)
    return <div>Ошибка при обновлении статьи: {updateError.message}</div>;

  return (
    <form
      className="create-article"
      onSubmit={handleSubmit(formData =>
        submitArticleUpdate(
          formData,
          slug,
          tags,
          updateArticle,
          navigate,
          refetch,
          dispatch,
        ),
      )}
    >
      <h1>Редактировать статью</h1>
      <Controller
        name="title"
        control={control}
        defaultValue=""
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
        defaultValue=""
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
        defaultValue=""
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

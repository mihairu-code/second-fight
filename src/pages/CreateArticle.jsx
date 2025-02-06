import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Icon, Label, TextArea, TextInput } from '@gravity-ui/uikit';
import { Pencil, SquarePlus } from '@gravity-ui/icons';
import { useCreateArticleMutation } from '@services/ConduitAPI';
import { useNavigate } from 'react-router';
import { editTag, handleTagUpdate, removeTag } from '@utils/cardFunctions';
import '@styles/Sign.less';

export default function CreateArticle() {
  const navigate = useNavigate();
  const [createArticle, { isLoading }] = useCreateArticleMutation();
  const [tagList, setTagList] = useState([]);
  const [editTagIndex, setEditTagIndex] = useState(null);

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

  const onSubmit = async data => {
    try {
      const response = await createArticle({
        ...data,
        body: data.text,
        tagList,
      }).unwrap();
      navigate(`/articles/${response.article.slug}`);
    } catch (error) {
      console.error('Ошибка при создании статьи:', error);
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
              tagList,
              setTagList,
              setValue,
              editTagIndex,
              setEditTagIndex,
            )
          }
          size="m"
          view="flat"
        >
          <Icon size={20} data={editTagIndex !== null ? Pencil : SquarePlus} />
        </Button>
        <div className="tags-list">
          {tagList.map((tag, index) => (
            <Label
              key={index}
              type="close"
              onClick={() => editTag(index, tagList, setValue, setEditTagIndex)}
              onCloseClick={() =>
                removeTag(
                  index,
                  tagList,
                  setTagList,
                  editTagIndex,
                  setEditTagIndex,
                )
              }
            >
              {tag}
            </Label>
          ))}
        </div>
      </section>

      <Button type="submit" size="l" view="action" disabled={isLoading}>
        {isLoading ? 'Создание...' : 'Создать статью'}
      </Button>
    </form>
  );
}

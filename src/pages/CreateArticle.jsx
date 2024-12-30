import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Icon, Label, TextArea, TextInput } from '@gravity-ui/uikit';
import { Pencil, SquarePlus } from '@gravity-ui/icons';
import { useCreateArticleMutation } from '@services/ConduitAPI';
import { useNavigate } from 'react-router'; // Импортируем useNavigate
import '@styles/Sign.less';

export default function CreateArticle() {
  const [createArticle, { isLoading }] = useCreateArticleMutation();
  const navigate = useNavigate(); // Инициализируем навигацию
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    mode: 'onChange',
  });

  const [tags, setTags] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const addTag = () => {
    const newTag = getValues('tag').trim();

    if (newTag.length > 12) return;

    if (editIndex !== null) {
      const updatedTags = [...tags];
      updatedTags[editIndex] = newTag;
      setTags(updatedTags);
      setEditIndex(null);
    } else if (newTag) {
      setTags([...tags, newTag]);
    }
    setValue('tag', '');
  };

  const removeTag = index => {
    setTags(tags.filter((_, i) => i !== index));
    if (editIndex === index) setEditIndex(null);
  };

  const editTag = index => {
    setValue('tag', tags[index]);
    setEditIndex(index);
  };

  const onSubmit = async data => {
    const { title, description, text } = data;

    try {
      await createArticle({
        title,
        description,
        body: text,
        tagList: tags,
      }).unwrap();
      console.log('Статья успешно создана');
      navigate('/articles'); // Перенаправляем на страницу со статьями
    } catch (error) {
      console.error('Ошибка создания статьи:', error);
    }
  };

  return (
    <form className="create-article" onSubmit={handleSubmit(onSubmit)}>
      <h1>Создать статью</h1>

      {/* Title */}
      <Controller
        name="title"
        control={control}
        defaultValue=""
        rules={{
          required: 'Заголовок обязателен',
        }}
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

      {/* Short Description */}
      <Controller
        name="description"
        control={control}
        defaultValue=""
        rules={{
          required: 'Краткое описание обязательно',
        }}
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

      {/* Text */}
      <Controller
        name="text"
        control={control}
        defaultValue=""
        rules={{
          required: 'Текст статьи обязателен',
        }}
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

      {/* Tags */}
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
        <Button type="button" onClick={addTag} size="m" view="flat">
          <Icon size={20} data={editIndex !== null ? Pencil : SquarePlus} />
        </Button>
        <div className="tags-list">
          {tags.map((tag, index) => (
            <Label
              key={index}
              type="close"
              onClick={() => editTag(index)}
              onCloseClick={() => removeTag(index)}
            >
              {tag}
            </Label>
          ))}
        </div>
      </section>

      {/* Submit */}
      <Button type="submit" size="l" view="action" disabled={isLoading}>
        {isLoading ? 'Создание...' : 'Создать статью'}
      </Button>
    </form>
  );
}

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Icon, Label, TextArea, TextInput } from '@gravity-ui/uikit';
import { Pencil, SquarePlus } from '@gravity-ui/icons';
import {
  useGetArticleBySlugQuery,
  useUpdateArticleMutation,
} from '@services/ConduitAPI';
import { useNavigate, useParams } from 'react-router';
import '@styles/Sign.less';

export default function EditArticle() {
  const { slug } = useParams(); // Получаем slug из URL
  const navigate = useNavigate();

  // Запрос для получения статьи по slug
  const { data, error, isLoading } = useGetArticleBySlugQuery(slug);
  const [
    updateArticle,
    { isLoading: isUpdating, isError, error: updateError },
  ] = useUpdateArticleMutation();

  // Инициализация формы
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm({
    mode: 'onChange',
  });

  // Теги
  const [tags, setTags] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // При загрузке данных статьи заполняем форму
  useEffect(() => {
    if (data) {
      const { title, description, body, tagList } = data.article;
      setValue('title', title);
      setValue('description', description);
      setValue('text', body);
      setTags(tagList);
    }
  }, [data, setValue]);

  // Добавление тега
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

  // Удаление тега
  const removeTag = index => {
    setTags(tags.filter((_, i) => i !== index));
    if (editIndex === index) setEditIndex(null);
  };

  // Редактирование тега
  const editTag = index => {
    setValue('tag', tags[index]);
    setEditIndex(index);
  };

  // Обработчик отправки формы
  const onSubmit = async data => {
    const { title, description, text } = data;

    const articleData = {
      slug,
      article: {
        title,
        description,
        body: text,
        tagList: tags,
      },
    };

    // Логируем данные перед отправкой
    console.log('Обновляем статью с данными:', articleData);

    try {
      const response = await updateArticle(articleData).unwrap();
      console.log('Ответ от API:', response);
      navigate(`/articles/${slug}`, { replace: true }); // Перенаправляем на страницу статьи
    } catch (error) {
      console.error('Ошибка обновления статьи:', updateError);
    }
  };

  // Обработка ошибок и состояния загрузки
  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка при загрузке статьи: {error.message}</div>;
  }

  if (isError && updateError) {
    return <div>Ошибка при обновлении статьи: {updateError.message}</div>;
  }

  return (
    <form className="create-article" onSubmit={handleSubmit(onSubmit)}>
      <h1>Редактировать статью</h1>

      {/* Title */}
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

      {/* Short Description */}
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

      {/* Text */}
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
      <Button type="submit" size="l" view="action" disabled={isUpdating}>
        {isUpdating ? 'Обновление...' : 'Обновить статью'}
      </Button>
    </form>
  );
}

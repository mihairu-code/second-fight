import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Icon, Label, TextArea, TextInput } from '@gravity-ui/uikit';
import { Gear } from '@gravity-ui/icons';
import '@styles/Sign.less';

export default function CreateArticle() {
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
    if (editIndex !== null) {
      // Редактирование существующего тега
      const updatedTags = [...tags];
      updatedTags[editIndex] = newTag;
      setTags(updatedTags);
      setEditIndex(null);
    } else if (newTag && /^[a-zA-Z]{1,8}$/.test(newTag)) {
      // Добавление нового тега
      setTags([...tags, newTag]);
    } else {
      // Валидация не пройдена
      return;
    }
    setValue('tag', ''); // Очистить поле ввода
  };

  const removeTag = index => {
    setTags(tags.filter((_, i) => i !== index));
    if (editIndex === index) setEditIndex(null);
  };

  const editTag = index => {
    setValue('tag', tags[index]);
    setEditIndex(index);
  };

  const onSubmit = data => {
    const { title, description, text } = data;
    console.log('Создание статьи:', { title, description, text, tags });
    // Здесь нужно добавить обработчик отправки статьи на сервер
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
            multiline
            rows={10} // Задает высоту текстового поля
          />
        )}
      />

      {/* Tags */}
      <section className="tags-section">
        <Controller
          name="tag"
          control={control}
          defaultValue=""
          rules={{
            required: 'Тег обязателен',
            minLength: {
              value: 1,
              message: 'Тег должен быть не менее 1 символа',
            },
            maxLength: {
              value: 8,
              message: 'Тег должен быть не более 8 символов',
            },
            pattern: {
              value: /^[a-zA-Z]+$/,
              message: 'Тег должен содержать только буквы',
            },
          }}
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
        <Button type="button" onClick={addTag} size="m" view="outlined-success">
          {editIndex !== null ? 'Редактировать тег' : 'Добавить тег'}
        </Button>
      </section>
      {/* Tags List */}
      <div className="tags-list">
        {tags.map((tag, index) => (
          <Label
            key={index}
            type="close"
            icon={<Icon size={16} data={Gear} onClick={() => editTag(index)} />}
          >
            {tag}
            <Icon
              size={16}
              data={Gear}
              onClick={() => removeTag(index)}
              style={{ cursor: 'pointer', marginLeft: '8px' }}
            />
          </Label>
        ))}
      </div>

      {/* Submit */}
      <Button type="submit" size="l" view="action">
        Создать статью
      </Button>
    </form>
  );
}

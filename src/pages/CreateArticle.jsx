import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Icon, Label, TextArea, TextInput } from '@gravity-ui/uikit';
import { Pencil, SquarePlus } from '@gravity-ui/icons';
import { useCreateArticleMutation } from '@services/ConduitAPI';
import { useDispatch, useSelector } from 'react-redux';
import { resetArticleForm, setArticleForm } from '@store/articleSlice';
import { useNavigate } from 'react-router';
import { editTag, handleTagUpdate, removeTag } from '@utils/cardFunctions';
import '@styles/Sign.less';

export default function CreateArticle() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createArticle, { isLoading }] = useCreateArticleMutation();

  const { title, description, body, tagList, editTagIndex } = useSelector(
    state => state.article.articleForm,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    mode: 'onChange',
    defaultValues: { title, description, text: body, tag: '' },
  });

  useEffect(() => {
    setValue('title', title);
    setValue('description', description);
    setValue('text', body);
  }, [title, description, body, setValue]);

  const onSubmit = async data => {
    const { title, description, text } = data;

    try {
      await createArticle({
        title,
        description,
        body: text,
        tagList,
      }).unwrap();
      console.log('Статья успешно создана');
      dispatch(resetArticleForm());
      navigate('/articles');
    } catch (error) {
      console.error('Ошибка создания статьи:', error);
    }
  };

  return (
    <form className="create-article" onSubmit={handleSubmit(onSubmit)}>
      <h1>Создать статью</h1>

      {/* Заголовок */}
      <Controller
        name="title"
        control={control}
        rules={{ required: 'Заголовок обязателен' }}
        render={({ field }) => (
          <TextInput
            {...field}
            onChange={e => {
              field.onChange(e);
              dispatch(setArticleForm({ title: e.target.value }));
            }}
            placeholder="Заголовок"
            error={!!errors.title}
            errorMessage={errors.title?.message}
          />
        )}
      />

      {/* Краткое описание */}
      <Controller
        name="description"
        control={control}
        rules={{ required: 'Краткое описание обязательно' }}
        render={({ field }) => (
          <TextInput
            {...field}
            onChange={e => {
              field.onChange(e);
              dispatch(setArticleForm({ description: e.target.value }));
            }}
            placeholder="Краткое описание"
            error={!!errors.description}
            errorMessage={errors.description?.message}
          />
        )}
      />

      {/* Текст статьи */}
      <Controller
        name="text"
        control={control}
        rules={{ required: 'Текст статьи обязателен' }}
        render={({ field }) => (
          <TextArea
            {...field}
            onChange={e => {
              field.onChange(e);
              dispatch(setArticleForm({ body: e.target.value }));
            }}
            placeholder="Текст статьи"
            error={!!errors.text}
            errorMessage={errors.text?.message}
            rows={10}
          />
        )}
      />

      {/* Теги */}
      <section className="tags-section">
        <Controller
          name="tag"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextInput
              {...field}
              placeholder="Добавить тег"
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
              tagList,
              newTags => dispatch(setArticleForm({ tagList: newTags })),
              setValue,
              editTagIndex,
              index => dispatch(setArticleForm({ editTagIndex: index })),
            )
          }
          size="m"
          view="flat"
        >
          <Icon size={20} data={editTagIndex !== null ? Pencil : SquarePlus} />
        </Button>

        {/* Отображение тегов */}
        <div className="tags-list">
          {Array.isArray(tagList) && tagList.length > 0 ? (
            tagList.map((tag, index) => (
              <Label
                key={index}
                type="close"
                onClick={() =>
                  editTag(index, tagList, setValue, index =>
                    dispatch(setArticleForm({ editTagIndex: index })),
                  )
                }
                onCloseClick={() =>
                  removeTag(
                    index,
                    tagList,
                    newTags => dispatch(setArticleForm({ tagList: newTags })),
                    editTagIndex,
                    index => dispatch(setArticleForm({ editTagIndex: index })),
                  )
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

      {/* Кнопка отправки */}
      <Button type="submit" size="l" view="action" disabled={isLoading}>
        {isLoading ? 'Создание...' : 'Создать статью'}
      </Button>
    </form>
  );
}

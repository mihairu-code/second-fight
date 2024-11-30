// Функция для случайных цветов тегов (если понадобится)
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

export { formatDate, randomColorTags };

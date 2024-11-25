import '@styles/ArticleCard.less';
import { Label, Text, User } from '@gravity-ui/uikit';

export default function ArticleCard({ data }) {
  const randomCollorTags = thisObj => {};
  const thisObj = {
    slug: data.slug,
    title: data.title,
    description: data.description,
    body: data.body,
    createdAt: data.createdAt,
    updatedAt: data.updated,
    tagList: data.tagList,
    favorited: data.favorited,
    favoritesCount: data.favoritesCount,
    author: {
      username: data.author.username,
      bio: data.bio,
      image: data.image,
      following: data.following,
    },
  };
  return (
    <article className="article-card">
      <title>{thisObj.title}</title>
      {thisObj.tagList.map(tag => (
        <Label theme="clear" children={tag} key={tag} />
      ))}
      <Text wordBreak="break-word" ellipsis={true} variant="caption-2">
        {thisObj.slug}
      </Text>
      <User
        avatar={{ text: 'Charles Darwin', theme: 'brand' }}
        name="Charles Darwin"
        description="charles@mail.ai"
        size="l"
      />
    </article>
  );
}

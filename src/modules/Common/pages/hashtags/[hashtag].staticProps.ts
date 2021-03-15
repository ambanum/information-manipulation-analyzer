import dbConnect from 'utils/db';
import { VolumetryGraphProps } from '../../components/Charts/VolumetryGraph';
import * as HashtagManager from '../../managers/HashtagManager';
import * as LanguageManager from 'modules/Countries/managers/LanguageManager';

export default async function getStaticProps({ params }: { params: { hashtag: string } }) {
  await dbConnect();
  const hashtag = await HashtagManager.get({ name: params.hashtag });

  const usernames: { [key: string]: number } = {};
  const languages: { [key: string]: number } = {};

  const volumetry = hashtag.volumetry.reduce(
    (acc: VolumetryGraphProps['data'], volumetry) => {
      const newAcc = [...acc];
      newAcc[0].data.push({ x: volumetry.date, y: volumetry.nbTweets || 0 });
      newAcc[1].data.push({ x: volumetry.date, y: volumetry.nbRetweets || 0 });
      newAcc[2].data.push({ x: volumetry.date, y: volumetry.nbLikes || 0 });
      newAcc[3].data.push({ x: volumetry.date, y: volumetry.nbQuotes || 0 });
      Object.keys(volumetry.languages).forEach((language) => {
        languages[language] = (languages[language] || 0) + volumetry.languages[language];
      });
      Object.keys(volumetry.usernames).forEach((username) => {
        usernames[username] = (usernames[username] || 0) + volumetry.usernames[username];
      });
      return acc;
    },
    [
      { id: 'nbTweets', data: [] },
      { id: 'nbRetweets', data: [] },
      { id: 'nbLikes', data: [] },
      { id: 'nbQuotes', data: [] },
    ]
  );

  return {
    props: {
      hashtag: hashtag ? JSON.parse(JSON.stringify(hashtag, null, 2)) : null,
      volumetry: JSON.parse(JSON.stringify(volumetry, null, 2)),
      usernames: JSON.parse(
        JSON.stringify(
          Object.keys(usernames).reduce(
            (acc: any[], username: string) => [
              ...acc,
              {
                id: username,
                label: username,
                value: usernames[username],
              },
            ],
            []
          ),
          null,
          2
        )
      ),
      languages: JSON.parse(
        JSON.stringify(
          Object.keys(languages).reduce(
            (acc: any[], language: string) => [
              ...acc,
              {
                id: language,
                label: LanguageManager.getName(language),
                value: languages[language],
              },
            ],
            []
          ),
          null,
          2
        )
      ),
    },
    revalidate: 300,
    notFound: !hashtag,
  };
}

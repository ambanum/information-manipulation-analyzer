import * as HashtagManager from '../../managers/HashtagManager';
import * as LanguageManager from 'modules/Countries/managers/LanguageManager';

import { VolumetryGraphProps } from '../../components/Charts/VolumetryGraph';
import dbConnect from 'utils/db';

export default async function getStaticProps({ params }: { params: { hashtag: string } }) {
  await dbConnect();
  const hashtag = await HashtagManager.get({ name: params.hashtag });

  const usernames: { [key: string]: number } = {};
  const languages: { [key: string]: number } = {};
  const associatedHashtags: { [key: string]: number } = {};
  let totalNbTweets: number = 0;

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
      Object.keys(volumetry.associatedHashtags).forEach((associatedHashtag) => {
        associatedHashtags[associatedHashtag] =
          (associatedHashtags[associatedHashtag] || 0) +
          volumetry.associatedHashtags[associatedHashtag];
      });
      totalNbTweets += volumetry.nbTweets;
      return acc;
    },
    [
      { id: 'nbTweets', data: [] },
      { id: 'nbRetweets', data: [] },
      { id: 'nbLikes', data: [] },
      { id: 'nbQuotes', data: [] },
    ]
  );

  const result = {
    hashtag: hashtag ? hashtag : null,
    volumetry,
    totalNbTweets,
    usernames: Object.keys(usernames).map((username) => ({
      id: username,
      label: username,
      value: usernames[username],
    })),
    languages: Object.keys(languages).map((language) => ({
      id: language,
      label: LanguageManager.getName(language),
      value: languages[language],
    })),
    associatedHashtags: Object.keys(associatedHashtags).map((associatedHashtag) => ({
      id: associatedHashtag,
      label: associatedHashtag,
      value: associatedHashtags[associatedHashtag],
    })),
  };

  return {
    props: JSON.parse(JSON.stringify(result)),
    revalidate: 300,
    notFound: !hashtag,
  };
}

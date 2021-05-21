import { createApi } from 'unsplash-js';

const getUnsplashImg = (() => {
  const unsplash = createApi({
    accessKey: '-6geO2cIsnu5Toy0Lvycp104VKg-twQgxYJwCk5ud2g',
  });

  const getImgInfos = async (keywords) => {
    try {
      const unsplashResp = await unsplash.photos.getRandom({
        query: keywords,
        count: 1,
      });
      if (unsplashResp.errors) {
        // handle error here
        console.log('Unsplash API error occurred: ', unsplashResp.errors[0]);
      } else {
        // handle success here
        const photo = unsplashResp.response;
        return {
          url: photo[0].urls.regular,
          creator: photo[0].user.username,
          creatorLink: photo[0].user.links.html,
          desc: photo[0].alt_description,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        url: 'no img url',
        creator: 'no creator',
        creatorLink: 'no creator link',
        desc: 'no img desc',
      };
    }
  };

  return { getImgInfos };
})();

export { getUnsplashImg };

import {USER_REF} from './authFunc';
export const addArticleToUserDatabase = async (id, article) => {
  try {
    // get user articles
    const user = await USER_REF.doc(id).get();
    const data = user.data();
    // if exist add to it
    if (data.articles) {
      USER_REF.doc(id)
        .set({articles: [...data.articles, article]}, {merge: true})
        .catch((err) => {
          console.log('isArticleExist -> err', err);
        });
    } else {
      // if dont exist make new.
      USER_REF.doc(id)
        .set({articles: [article]}, {merge: true})
        .catch((err) => {
          console.log('isArticleExist -> err', err);
        });
    }
  } catch (error) {
    console.log('isArticleExist -> error', error);
  }
};

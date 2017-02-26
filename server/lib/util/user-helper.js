"use strict";


const md5 = require('md5');

module.exports = {

  generateUserObject: (name, handle, usrPwd) => {
    const avatarUrlPrefix = `https://vanillicon.com/${md5(handle)}`;
    const avatars = {
      small:   `${avatarUrlPrefix}_50.png`,
      regular: `${avatarUrlPrefix}.png`,
      large:   `${avatarUrlPrefix}_200.png`
    };

    const user = {
      name: name,
      handle: handle,
      avatars: avatars
    };
    if (usrPwd) {
      user['usrPwd'] = usrPwd;
      user['created_at'] = Date.now();
      user['statuses_count'] = 0;
      user['favourites_count'] = 0;
    }

    return user;
  }

};

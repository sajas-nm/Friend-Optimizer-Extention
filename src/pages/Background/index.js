import '../../assets/img/128.png';
import db from '../../db';
import human from 'humanparser';

console.log('[Friend Optimizer Baground Script Running]');

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request?.message === 'sync-all-friends') {
    console.log('message received for sync-all-friends');
    const result = await syncFacebook();
    chrome.runtime.sendMessage({
      message: 'syc-all-friends-status',
      payload: result,
    });
  } else if (request?.message === 'terminate-process') {
    const item = {
      id: 1,
      isTerminated: true,
      //set from 24 hours now
      pauseAt: new Date().getTime() + 1 * 24 * 60 * 60 * 1000,
      message: 'process pause for 24 hours...;;;;;;',
    };
    console.log('item', item);
    try {
      await db.table('config').put(item, [1]);
      chrome.tabs.remove(sender?.tab?.id);
    } catch (error) {
      console.error('error', error);
      chrome.tabs.remove(sender?.tab?.id);
    }
  } else if (request?.closeWindow) {
    // console.log('sender', sender);

    console.log(request, 'reqst from CS ');

    try {
      const campaignId = request?.data?.campaignId;
      console.log(
        '🚀 ~ file: index.js ~ line 21 ~ chrome.runtime.onMessage.addListener ~ campaignId',
        campaignId
      );
      const userId = request?.data?.userId;
      console.log(
        '🚀 ~ file: index.js ~ line 23 ~ chrome.runtime.onMessage.addListener ~ userId',
        userId
      );

      let campaignsData = await db.table('campaign').get(parseInt(campaignId));

      console.log(campaignsData, 'campaignsData');

      // console.log(
      //   '🚀 ~ file: index.js ~ line 32  campaignsData',
      //   campaignsData
      // );
      // console.log('🚀 ~ file: index.js ~ line 32 ~ request', request);

      if (request?.data?.messageSent === true) {
        // updateCampaign
        // delete sender and increse count
        const historyLastIndex = campaignsData.history.length - 1;
        campaignsData.history[historyLastIndex].count =
          campaignsData.history[historyLastIndex].count + 1;
      }
      // else {
      //   // updateCampaign
      //   // delete sender
      // }

      const index = campaignsData.senders.indexOf(userId);
      console.log(
        '🚀 ~ file: index.js ~ line 49 ~ chrome.runtime.onMessage.addListener ~ index',
        index
      );
      if (index > -1) {
        console.log('tru    =>');
        let sentUser = campaignsData.senders.splice(index, 1);
        console.log('sentUser=>', sentUser);
        if (request?.data?.messageSent === true) {
          campaignsData.sent.push(...sentUser);
        }
        // campaignsData.totalMessage = campaignsData.senders.length;
      }
      // console.log(
      //   '🚀 ~ file: index.js ~ line 49 ~ chrome.runtime.onMessage.addListener ~ campaignsData',
      //   campaignsData
      // );

      await db.table('campaign').update(parseInt(campaignId), campaignsData);
    } catch (error) {
      console.error('[error]', error);
    }
    chrome.tabs.remove(sender?.tab?.id);
  } else if (request?.message === 'syc-new-friends') {
    console.log('request', request);
    chrome.tabs.remove(sender?.tab?.id);
    if (request.success) {
      let tableName =
        request.type === 'new'
          ? 'newfriend'
          : request.type === 'all'
            ? 'friend'
            : null;

      const newFriendsWithNameParsed = request.payload.map((data) => {
        const attrs = human.parseName(data.name);
        data.first_name = attrs?.firstName;
        data.last_name = attrs?.lastName;
        data.active = 0;
        data.whitelisted = 0;
        data.like_count = 0;
        data.comment_count = 0;
        return data;
        // id,active,whitelisted,username,like_count,comment_count
      });

      let updatedNewfriendList = newFriendsWithNameParsed.map(async (v) => {
        let imagepath = v.profile_image;

        const toDataURL = (url) =>
          fetch(url)
            .then((response) => response.blob())
            .then(
              (blob) =>
                new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                })
            );

        toDataURL(imagepath).then((dataUrl) => {
          v.base64Profile = dataUrl;
        });

        return v;
      });

      // console.log(friendList, 'updatedfriendList');

      updatedNewfriendList = await Promise.all(updatedNewfriendList);

      console.log('newFriendsWithNameParsed', updatedNewfriendList);

      console.log(tableName);

      await db.table(tableName).clear();

      await db.table(tableName).bulkAdd(updatedNewfriendList);
      console.log('added to DB');

      return {
        success: true,
      };

      // insertNewFriends(data, tableName);
    }
  } else if (request?.message === 'check-fb-auth') {
    getUserId()
      .finally((r) => {
        chrome.runtime.sendMessage({
          message: 'fb-auth-state',
          payload: true,
          redirectTo: request.redirectTo,
          friendIds: request.friendIds, //only for unfriend
        });
      })
    // .catch((e) => {
    //   console.log('Error', e);
    //   chrome.runtime.sendMessage({
    //     message: 'fb-auth-state',
    //     payload: false,
    //   });
    // });
  } else if (request?.message === 'remove-friend-callback') {
    if (request.success) {
      try {
        console.log('...', request);

        const _friend = await db.table('friend').get(request.friend_id);
        const _un_friend_data = {
          base64Profile: _friend?.base64Profile,
          first_name: _friend?.first_name,
          id: _friend?.id,
          last_name: _friend.last_name,
          name: _friend.name,
          profile_image: _friend.profile_image,
          username: _friend.username,
        };
        await db.table('unfriended').put(_un_friend_data, [request.friend_id]);
        await db.table('friend').delete(request.friend_id);
        // chrome.tabs.remove(sender?.tab?.id);
        chrome.runtime.sendMessage({
          message: 'continue-process',
        });

        chrome.runtime.sendMessage({
          message: 're-fetch',
        });
      } catch (error) {
        console.error('error', error);
        // chrome.tabs.remove(sender?.tab?.id);
        chrome.runtime.sendMessage({
          message: 're-fetch',
        });
      }
    } else {
      console.error('unfriend faild');
      chrome.tabs.remove(sender?.tab?.id);
    }
  } else if (request?.message === 'remove-friend-completed') {
    chrome.runtime.sendMessage({
      message: 'remove-listener',
    });
    chrome.tabs.remove(sender?.tab?.id);
  } else if (
    request?.message === 'scand-post' ||
    request?.message === 'scand-post-bulk'
  ) {
    const _payLoad = request.payload;
    if (request.like_profiles && request.like_profiles.length > 0) {
      for await (const uid of request.like_profiles) {
        const userByID = await db.table('friend').get({ id: uid });
        const userBYUN = await db.table('friend').get({ username: uid });
        if (userByID) {
          const preCount = Number(userByID?.like_count);
          const finalCount = isNaN(preCount) ? 0 : preCount;
          // userByID['like_count'] = userByID?.like_count
          //   ? userByID?.like_count
          //   : 0;
          await db
            .table('friend')
            .where('id')
            .equals(userByID.id)
            .modify({ like_count: finalCount + 1 });
        } else if (userBYUN) {
          // userBYUN['like_count'] = userBYUN?.like_count
          //   ? userBYUN?.like_count
          //   : 0;
          const preCount = Number(userBYUN?.like_count);
          const finalCount = isNaN(preCount) ? 0 : preCount;
          await db
            .table('friend')
            .where('username')
            .equals(userBYUN.username)
            .modify({ like_count: finalCount + 1 });
        }
      }
    }

    if (request.comment_profiles && request.comment_profiles.length > 0) {
      for await (const uid of request.comment_profiles) {
        const userByID = await db.table('friend').get({ id: uid });
        const userBYUN = await db.table('friend').get({ username: uid });
        if (userByID) {
          // userByID['like_count'] = userByID?.comment_count
          //   ? userByID?.comment_count
          //   : 0;
          const preCount = Number(userByID?.comment_count);
          const finalCount = isNaN(preCount) ? 0 : preCount;
          await db
            .table('friend')
            .where('id')
            .equals(userByID.id)
            .modify({ comment_count: finalCount + 1 });
        } else if (userBYUN) {
          // userBYUN['like_count'] = userBYUN?.comment_count
          //   ? userBYUN?.comment_count
          //   : 0;
          const preCount = Number(userBYUN?.comment_count);
          const finalCount = isNaN(preCount) ? 0 : preCount;
          await db
            .table('friend')
            .where('username')
            .equals(userBYUN.username)
            .modify({ comment_count: finalCount + 1 });
        }
      }
    }
    const _file =
      request.message === 'scand-post-bulk'
        ? 'scanPostActionBulkScript.bundle.js'
        : 'scanPostScript.bundle.js';
    chrome.tabs.update(
      sender?.tab?.id,
      {
        active: true,
        url: _payLoad,
      },
      function (tab) {
        const listener = (tabId, changeInfo, tab) => {
          if (tab.status === 'complete') {
            console.log('tab.status');
            chrome.tabs.executeScript(sender?.tab?.id, {
              file: _file,
            });

            chrome.tabs.onUpdated.removeListener(listener);
          }
        };

        chrome.tabs.onUpdated.addListener(listener);
      }
    );
  } else if (request?.message === 'scand-post-list') {
    const _payLoad = request.payload;
    await db.table('post').clear();
    const newPosts = _payLoad
      ?.map((v) => {
        if (v.atrData) {
          const data = JSON.parse(v.atrData);
          if (data?.target_id) {
            return {
              id: data.target_id,
              title: v.title,
            };
          }
        }
      })
      .filter(Boolean);

    await db.table('post').bulkAdd(newPosts);
    console.log('[Post added to DB]');

    chrome.runtime.sendMessage({
      message: 'scand-post-list-success',
    });
    chrome.tabs.remove(sender?.tab?.id);
    //
  } else if (request?.message === 'scand-post-compleated') {
    await modifyActiveFriends();
    chrome.runtime.sendMessage({
      message: 'scand-post-success',
    });
    chrome.tabs.remove(sender?.tab?.id);
  } else if (request?.message === 'scand-post-action-compleated') {
    if (request.like_profiles && request.like_profiles.length > 0) {
      for await (const uid of request.like_profiles) {
        const userByID = await db.table('friend').get({ id: uid });
        const userBYUN = await db.table('friend').get({ username: uid });
        if (userByID) {
          const preCount = Number(userByID?.like_count);
          const finalCount = isNaN(preCount) ? 0 : preCount;
          await db
            .table('friend')
            .where('id')
            .equals(userByID.id)
            .modify({ like_count: finalCount + 1 });
        } else if (userBYUN) {
          const preCount = Number(userBYUN?.like_count);
          const finalCount = isNaN(preCount) ? 0 : preCount;
          await db
            .table('friend')
            .where('username')
            .equals(userBYUN.username)
            .modify({ like_count: finalCount + 1 });
        }
      }
    }

    if (request.comment_profiles && request.comment_profiles.length > 0) {
      for await (const uid of request.comment_profiles) {
        const userByID = await db.table('friend').get({ id: uid });
        const userBYUN = await db.table('friend').get({ username: uid });
        if (userByID) {
          const preCount = Number(userByID?.comment_count);
          const finalCount = isNaN(preCount) ? 0 : preCount;
          await db
            .table('friend')
            .where('id')
            .equals(userByID.id)
            .modify({ comment_count: finalCount + 1 });
        } else if (userBYUN) {
          const preCount = Number(userBYUN?.comment_count);
          const finalCount = isNaN(preCount) ? 0 : preCount;
          await db
            .table('friend')
            .where('username')
            .equals(userBYUN.username)
            .modify({ comment_count: finalCount + 1 });
        }
      }
    }

    // await db
    //   .table('friend')
    //   .where('like_count')
    //   .aboveOrEqual(1)
    //   .modify({ active: 1 });
    // await db
    //   .table('friend')
    //   .where('comment_count')
    //   .aboveOrEqual(1)
    //   .modify({ active: 1 });
    await modifyActiveFriends();

    chrome.runtime.sendMessage({
      message: 'scand-post-success',
    });
    chrome.tabs.remove(sender?.tab?.id);
  } else if (request?.message === 'sync-all-friends-mbasic') {
    await db.table('friend').clear();
    chrome.tabs.create({
      url: 'https://mbasic.facebook.com/me/friends?mbasic_scraper_fr=true',
    });
  } else if (request.message === 'mbasic-collect-friends') {
    console.log('Bulk adding friends', request.friendList);

    let friendList = request.friendList.map(async (v) => {
      let imagepath = v.profile_image;

      const toDataURL = (url) =>
        fetch(url)
          .then((response) => response.blob())
          .then(
            (blob) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              })
          );

      const dataUrl = await toDataURL(imagepath)
      v.base64Profile = dataUrl;

      return v;
    });

    friendList = await Promise.all(friendList);
    console.log('Bulk adding friends', friendList);


    await db.table('friend').bulkAdd(friendList);
  } else if (request.closeMbasic) {
    console.log('Tab will be closed ==', request);
    chrome.tabs.remove(sender?.tab?.id);
  }
});

async function modifyActiveFriends() {
  console.log('[modifyActiveFriends start]');
  await db.table('friend').toCollection().modify({ active: 0 });
  await db
    .table('friend')
    .where('like_count')
    .aboveOrEqual(1)
    .modify({ active: 1 });
  await db
    .table('friend')
    .where('comment_count')
    .aboveOrEqual(1)
    .modify({ active: 1 });

  // await db
  //   .table('friend')
  //   .where('like_count')
  //   .equals(0)
  //   .and(function (friend) {
  //     console.log('friend>>', friend);
  //     return friend.comment_count === 0;
  //   })
  //   .modify({ active: 0 });
  console.log('[modifyActiveFriends end]');
}

async function getUserId() {
  try {
    let accessToken = await getAccesToken();
    // get token
    if (!accessToken) {
      throw new Error('access denied');
    }

    // get all friends in a loop - and set profile pics
    const response2 = await fetch(
      // 'https://graph.facebook.com/v1.0/me?fields=id,name,username&access_token=' + accessToken
      `https://graph.facebook.com/me?access_token=${accessToken}`
    );
    const loginUserData = await response2.json();
    console.log('loginUserData', loginUserData);
    localStorage.setItem('loginUserData', JSON.stringify(loginUserData));
    return true;
  } catch (error) {
    console.log('[error]', error);
    throw new Error('Login to FB');
  }
}

async function getAccesToken() {
  try {
    const response = await fetch(
      // 'https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed'
      'https://business.facebook.com/creatorstudio/home'
    );
    const txt2 = await response.text();
    let accessToken = '';
    if (txt2) {
      var Stringarray = txt2.split(',');
      Stringarray.forEach((element) => {
        if (element.includes('accessToken')) {
          accessToken = element
            .split(':')[1]
            .replace('\\', '')
            .replace('\\', '')
            .replace(/["]/g, '');
        } else {
          // console.error('No access token found');
          // throw Error('No access token found');
        }
      });
    }
    return accessToken;
  } catch (error) {
    console.error('error', error);
    throw new Error('Login to Facebook');
  }
}

async function syncFacebook() {
  try {
    const response = await fetch(
      // 'https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed'
      'https://business.facebook.com/creatorstudio/home'
    );
    const txt2 = await response.text();
    let accessToken = '';
    if (txt2) {
      var Stringarray = txt2.split(',');
      Stringarray.forEach((element) => {
        if (element.includes('accessToken')) {
          accessToken = element
            .split(':')[1]
            .replace('\\', '')
            .replace('\\', '')
            .replace(/["]/g, '');
        } else {
          // console.log('No access token found');
        }
      });
    }

    const limit = 500;
    let loadMore = true;
    // let nextEndpoint = `https://graph.facebook.com/v1.0/me/friends?fields=picture,first_name,last_name,name,firstName,lastName,id,username&limit=${limit}&access_token=${accessToken}`;
    let nextEndpoint = `https://graph.facebook.com/me/friends?access_token=${accessToken}`;
    const friendsData = [];

    while (loadMore) {
      const response2 = await fetch(nextEndpoint);

      const currentData = await response2.json();

      friendsData.push(...currentData.data);
      if (currentData.paging.next) {
        nextEndpoint = currentData.paging.next;
      } else {
        loadMore = false;
      }
    }

    let newData = friendsData.map((v) => {
      let data = v;
      // data.profile_image = v.picture.data.url;
      data.profile_image = `https://graph.facebook.com/${v.id}/picture?height=500&access_token=${accessToken}`;
      delete data.picture;
      data.whitelisted = 0; //bool
      data.active = 1; //bool
      data.like_count = 0;
      data.comment_count = 0;
      return data;
    });

    // clear the friends table

    let friendList = newData.map(async (v) => {
      let imagepath = v.profile_image;

      const toDataURL = (url) =>
        fetch(url)
          .then((response) => response.blob())
          .then(
            (blob) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              })
          );

      const dataUrl = await toDataURL(imagepath)
      v.base64Profile = dataUrl;

      return v;
    });

    friendList = await Promise.all(friendList);
    console.log(friendList, 'updatedfriendList');

    await db.table('friend').clear();

    await db.table('friend').bulkAdd(friendList);

    return {
      success: true,
      totalFriendsSyncd: friendList.length,
    };
  } catch (error) {
    console.error('error', error);
    return {
      success: false,
      totalFriendsSyncd: 0,
    };
  }
}

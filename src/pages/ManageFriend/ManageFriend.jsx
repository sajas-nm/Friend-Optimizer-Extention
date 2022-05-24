/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import ScrapperIcon from '../../assets/icons/scraper.svg';
import ApiIcon from '../../assets/icons/api.svg';

import db from '../../db';
import Table from './utils/Table';
import TablePost from './utils/TablePost';
import ReactPaginate from 'react-paginate';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

const AddCampaign = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const [allSelected, setAllSelected] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [totalFriends, setTotalFriend] = useState(0);

  const [unFriendsList, setUnFriendsList] = useState([]);
  const [selectedFriendList, setSelectedFriendsList] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [isAddingCampaign, setIsAddingCampaign] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const [attributes, setAttributes] = useState({});

  //
  const [isSyncSuccess, setSyncSuccess] = useState(false);
  const [isSyncError, setSyncError] = useState(false);
  const [isSyncingApi, setIsSyncingApi] = useState(false);
  const [isSyncingScraper, setIsSyncingScrapper] = useState(false);
  const [isSyncingScraperNew, setIsSyncingScrapperNew] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [tab, setTab] = useState('all-friends');
  const [currentPage, setCurrentPage] = React.useState(0);
  const [removeListener, setRemoveListener] = React.useState(false);
  const [postsList, setPostsList] = useState([]);

  const [friendsCount, setCounter] = React.useState({
    all: 0,
    active: 0,
    inactive: 0,
    whitelisted: 0,
    unfriended: 0,
  });

  const [unfriendModal, setUnfriendModal] = useState(false);
  const [scanPostModal, setScanPostModal] = useState(false);
  const [scanPostListModal, setScanPostListModal] = useState(false);
  const [delayRemove, setDelayRemove] = useState('10000');
  const [numberOfPost, setNumberOfPost] = useState('10');

  useEffect(() => {
    fetchAllFriends(currentPage);

    chrome.runtime.onMessage.addListener(listener);
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, [tab]);

  const syncAllFriendsMbasic = () => {
    chrome.runtime.sendMessage({
      message: 'sync-all-friends-mbasic',
    });
  };

  const listener = (request, sender) => {
    if (request.message === 'syc-all-friends-status') {
      console.log(request?.success);
      if (request?.payload?.success) {
        console.log('request?.payload', request?.payload);
        setSyncSuccess(true);
        setAlertMessage(
          ` sucessfully syncd ${request?.payload?.totalFriendsSyncd} friends`
        );
        fetchAllFriends(currentPage);
      } else {
        setSyncError(true);
        setAlertMessage(`syncd faild try again`);
      }
      setIsSyncingApi(false);

      setTimeout(() => {
        setSyncSuccess(false);
        setSyncError(false);
        setAlertMessage('');
      }, 5000);
    } else if (request.message === 'syc-new-friends') {
      setIsSyncingScrapper(false);
      setIsSyncingScrapperNew(false);
      console.log('request', request.payload);
      if (request?.success) {
        console.log('request?.payload', request?.payload);
        setSyncSuccess(true);
        setAlertMessage(
          `You have sucessfully syncd ${request?.payload?.length} friends`
        );
      } else {
        setSyncError(true);
        setAlertMessage(`syncd faild try again`);
      }
      setTimeout(() => {
        setSyncSuccess(false);
        setSyncError(false);
        setAlertMessage('');
      }, 5000);
    } else if (request.message === 'fb-auth-state') {
      // setIsSyncingApi(false);
      console.log('request', request);
      if (request.payload) {
        if (request.redirectTo === 'new-friends') {
          startSync('new');
          // window.open(chrome.runtime.getURL('syncFrinds') + '.html?to=new');
        } else if (request.redirectTo === 'all-friends-scraper') {
          startSync('all');
          // window.open(chrome.runtime.getURL('syncFrinds') + '.html?to=all');
        } else if (request.redirectTo === 'all-friends-api') {
          syncAllFriends();
        } else if (request.redirectTo === 'unfriend') {
          handleRemoveFriends(request.friendIds);
        } else if (request.redirectTo === 'scan-post') {
          setScanPostModal(true);
        } else if (request.redirectTo === 'scan-post-list') {
          setScanPostModal(true);
        } else if (request.redirectTo === 'all-friends-mbasic') {
          syncAllFriendsMbasic();
        }
      } else {
        // setIsSyncingApi(false);
        console.log('fb auth faild');
        setSyncError(true);
        setAlertMessage(
          `make sure you are already login in to your facebook account! or check your network settings and try again!`
        );
      }
    } else if (request?.message === 're-fetch') {
      fetchAllFriends(0);
    } else if (request?.message === 'remove-listener') {
      setRemoveListener(true);
      // alert('remove friend compleated!');
      setSelectedFriendsList([]);
      window.location.reload();
    } else if (request?.message === 'scand-post-success') {
      alert('Post scan successfully completed!');
      window.location.reload();
    } else if (request?.message === 'scand-post-list-success') {
      alert('Post scan list successfully completed!');
      window.location.reload();
    }
  };

  const PER_PAGE = 20;

  const [pageCount, setCount] = useState(0);
  const fetchAllFriends = async (cp, _clear) => {
    try {
      const friend_collection_ref = db.table('friend');
      // Count START
      const totalAllFriends = await db.table('friend').count();
      const totalAllPost = await db.table('post').count();
      const totalInActiveFriends = await friend_collection_ref
        .where('active')
        .equals(0)
        .count();
      // const toalActiveFriends = totalAllFriends - totalInActiveFriends;
      const toalActiveFriends = await friend_collection_ref
        .where('active')
        .aboveOrEqual(1)
        .count();

      const totalWhiteListedFriends = await friend_collection_ref
        .where('whitelisted')
        .equals(1)
        .count();

      const totalUnFriends = await db.table('unfriended').count();

      setCounter((ps) => {
        return {
          ...ps,
          all: totalAllFriends,
          active: toalActiveFriends,
          inactive: totalInActiveFriends,
          whitelisted: totalWhiteListedFriends,
          unfriended: totalUnFriends,
          posts: totalAllPost,
        };
      });
      // Count END

      const offset = cp * PER_PAGE;
      const friendRef = friend_collection_ref;
      const unFriendRef = db.table('unfriended');
      console.log({ tab });
      let ref;
      if (tab === 'in-active-friends') {
        ref = friendRef.where('active').equals(0);
        setCount(Math.ceil(totalInActiveFriends / PER_PAGE));
        setTotalFriend(totalInActiveFriends); //to dispaly in table footer
      } else if (tab === 'active-friends') {
        ref = friendRef.where('active').aboveOrEqual(1);
        setCount(Math.ceil(toalActiveFriends / PER_PAGE));
        setTotalFriend(toalActiveFriends);
      } else if (tab === 'white-lists') {
        ref = friendRef.where('whitelisted').equals(1);
        setCount(Math.ceil(totalWhiteListedFriends / PER_PAGE));
        setTotalFriend(totalWhiteListedFriends);
      } else if (tab === 'all-friends') {
        ref = friendRef;
        setCount(Math.ceil(totalAllFriends / PER_PAGE));
        setTotalFriend(totalAllFriends);
      } else if (tab === 'unfriended') {
        ref = unFriendRef;
        setCount(Math.ceil(totalUnFriends / PER_PAGE));
        setTotalFriend(totalUnFriends);
      } else if (tab === 'posts') {
        ref = db.table('post');
        setCount(Math.ceil(totalAllPost / PER_PAGE));
        setTotalFriend(totalAllPost);
      }
      console.log({ searchQuery });
      let searchString = searchQuery;
      if (_clear) {
        searchString = '';
      }

      if (tab === 'posts') {
        const result = await ref
          // .orderBy(':id')
          .filter((f) =>
            f?.id
              ?.toString()
              .toLowerCase()
              ?.includes(searchString.toLowerCase())
          )
          .offset(offset)
          .limit(PER_PAGE)
          .toArray();
        setPostsList(result);
      } else {
        const result = await ref
          // .orderBy(':id')
          .filter((f) =>
            f?.name?.toLowerCase()?.includes(searchString.toLowerCase())
          )
          .offset(offset)
          .limit(PER_PAGE)
          .toArray();
        console.log('result', result);
        setFriendsList(result);
      }
    } catch (error) {
      console.error('[fetchAllFriends]', error);
    }
  };

  const handleSelectedFriends = (frn) => {
    let currentFriendsList = selectedFriendList.map((a) => a);

    if (currentFriendsList.some((v) => v.id === frn.id)) {
      const unselectedFriendsList = currentFriendsList.filter(
        (v) => v.id !== frn.id && v
      );

      setSelectedFriendsList(unselectedFriendsList);
    } else {
      currentFriendsList.push(frn);
      setSelectedFriendsList(currentFriendsList);
    }
  };

  const handleSelectePost = (pid) => {
    let currenPostList = selectedPosts.map((a) => a);

    if (currenPostList.includes(pid)) {
      const unselectedPostList = currenPostList.filter((v) => v !== pid);

      setSelectedPosts(unselectedPostList);
    } else {
      currenPostList.push(pid);
      setSelectedPosts(currenPostList);
    }
  };

  const updateStatus = async (type, value) => {
    try {
      const _payLoad = selectedFriendList?.map((data) => {
        if (type === 'white-lists') {
          return {
            ...data,
            whitelisted: value,
          };
        } else if (type === 'active') {
          return {
            ...data,
            active: value,
          };
        } else {
          return {
            ...data,
          };
        }
      });

      await db.table('friend').bulkPut(_payLoad);
      setIsAddingCampaign(false);
      setIsSuccess(true);
      let message =
        type === 'white-lists'
          ? `${selectedFriendList?.length} friends succesfully whitelisted!`
          : type === 'active'
          ? `${selectedFriendList?.length} friends succesfully inactivated!`
          : ``;
      fetchAllFriends(currentPage);

      // alert(message);
      setSelectedFriendsList([]);
      setTimeout(() => {
        setIsSuccess(false);
      }, 1000);
    } catch (error) {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 1000);
      console.error('[createCampaign Error]', error);
    }
  };

  const syncAllFriends = () => {
    chrome.runtime.sendMessage({ message: 'sync-all-friends' });
  };
  const checkFacebookAuth = (redirectTo) => {
    const friendIds = selectedFriendList?.map((v) => v?.id); //only for unfriend
    chrome.runtime.sendMessage({
      message: 'check-fb-auth',
      redirectTo: redirectTo,
      friendIds: friendIds || [],
    });
    setTimeout(() => {
      setIsSyncingScrapper(false);
    }, 3000);
  };

  const clearTable = async (tableName) => {
    try {
      await db.table(tableName).clear();
    } catch (error) {
      console.error('[clearTable error]', error);
    }
  };

  const startSync = (to) => {
    let tableName = to === 'new' ? 'newfriend' : to === 'all' ? 'friend' : null;
    clearTable(tableName);
    // setIsSyncing(true);

    setTimeout(() => {
      let loginUserData = JSON.parse(localStorage.getItem('loginUserData'));
      // console.log(loginUserData, 'loginUserData');
      if (!loginUserData?.id) {
        setIsError(true);
        setAlertMessage(`syncd faild try again`);
        return;
      }
      const path =
        to === 'new' ? 'friends_recent' : to === 'all' ? 'friends' : null;

      // const file= to === 'new' ? 'friends_recent' : to === 'all' ? 'friends' : null;

      chrome.tabs.create(
        {
          // active: false,
          url: `https://www.facebook.com/${loginUserData?.id}/${path}?mcAutomated=true&type=${to}`,
        },
        (tabb) => {
          const listener = (tabId, changeInfo, tab) => {
            const url = new URL(tab.url);
            console.log(url);
            //&& url.hostname === 'facebook.com'
            if (tab.status === 'complete') {
              console.log('tab.status');
              chrome.tabs.executeScript(tabb.id, {
                // code: `alert('ollks')`,
                file: `sycFriendsScript.bundle.js`,
              });
              chrome.tabs.onUpdated.removeListener(listener);
            }
          };
          chrome.tabs.onUpdated.addListener(listener);
        }
      );
    }, 2000);
  };
  const [removeFriends, setRemoveFriends] = useState([]);
  const handleRemoveFriends = (friend_ids) => {
    if (friend_ids.length === 0) {
      alert('no friends selected!');
      return;
    }
    setRemoveFriends(friend_ids);
    setUnfriendModal(true);
  };

  const startRemoveFriends = async () => {
    let loginUserData = JSON.parse(localStorage.getItem('loginUserData'));
    if (!loginUserData?.id) {
      setIsError(true);
      setAlertMessage(`syncd faild try again`);
      return;
    }

    if (!removeFriends || removeFriends.length === 0) {
      return;
    }

    var winObj = {
      // url: `https://mbasic.facebook.com/removefriend.php?friend_id=${
      //   removeFriends[0]
      // }&fr_friends=${encodeURIComponent(
      //   JSON.stringify(removeFriends)
      // )}&delay=${delayRemove}`,

      url: isNaN(removeFriends[0])
        ? `https://mbasic.facebook.com/${
            removeFriends[0]
          }?fr_friends=${encodeURIComponent(
            JSON.stringify(removeFriends)
          )}&delay=${delayRemove}`
        : `https://mbasic.facebook.com/profile.php?id=${
            removeFriends[0]
          }&fr_friends=${encodeURIComponent(
            JSON.stringify(removeFriends)
          )}&delay=${delayRemove}`,

      width: 400,
      height: 400,
      focused: true,
      type: 'popup',
      state: 'normal',
    };

    chrome.windows.create(winObj, function (newWindow) {
      // console.log(newWindow);
      setUnfriendModal(false);
      setRemoveFriends([]);

      const listener = (tabId, changeInfo, tab) => {
        const url = new URL(tab.url);
        console.log(url);
        //&& url.hostname === 'facebook.com'
        if (tab.status === 'complete') {
          console.log('tab.status');
          chrome.tabs.executeScript(newWindow.tabs[0].id, {
            file: `removeFriendsScript.bundle.js`,
          });

          // chrome.tabs.onUpdated.removeListener(listener);
        }
      };
      if (removeListener) {
        chrome.tabs.onUpdated.removeListener(listener);
      }
      chrome.tabs.onUpdated.addListener(listener);
    });
  };

  const scanPosts = async () => {
    chrome.storage.local.clear();

    let loginUserData = JSON.parse(localStorage.getItem('loginUserData'));
    if (!loginUserData?.id) {
      setIsError(true);
      setAlertMessage(`syncd faild try again`);
      return;
    }

    var winObj = {
      url: `https://m.facebook.com/${loginUserData.id}?post_count=${numberOfPost}`,

      width: 400,
      height: 800,
      focused: true,
      type: 'popup',
      state: 'normal',
    };

    // await db
    //   .table('friend')
    //   .where('active')
    //   .equals(1)
    //   .modify({ active: 1, like_count: 0, comment_count: 0 });

    // await db
    //   .table('friend')
    //   .where('active')
    //   .equals(0)
    //   .modify({ active: 1, like_count: 0, comment_count: 0 });

    chrome.windows.create(winObj, async function (newWindow) {
      // console.log(newWindow);
      setScanPostModal(false);

      const listener = (tabId, changeInfo, tab) => {
        const url = new URL(tab.url);
        console.log(url);
        //&& url.hostname === 'facebook.com'
        if (tab.status === 'complete') {
          console.log('tab.status');
          chrome.tabs.executeScript(newWindow.tabs[0].id, {
            file: `scanPostScript.bundle.js`,
          });

          chrome.tabs.onUpdated.removeListener(listener);
        }
      };
      // if (removeListener) {
      // }
      chrome.tabs.onUpdated.addListener(listener);
    });
  };

  const scanSinglePost = async (postId) => {
    let loginUserData = JSON.parse(localStorage.getItem('loginUserData'));
    if (!loginUserData?.id) {
      setIsError(true);
      setAlertMessage(`syncd faild try again`);
      return;
    }
    var winObj = {
      url: `https://m.facebook.com/${postId}`,

      width: 400,
      height: 800,
      focused: true,
      type: 'popup',
      state: 'normal',
    };

    // await db
    //   .table('friend')
    //   .where('active')
    //   .equals(1)
    //   .modify({ active: 1, like_count: 0, comment_count: 0 });

    // await db
    //   .table('friend')
    //   .where('active')
    //   .equals(0)
    //   .modify({ active: 1, like_count: 0, comment_count: 0 });
    chrome.windows.create(winObj, async function (newWindow) {
      const listener = (tabId, changeInfo, tab) => {
        const url = new URL(tab.url);
        if (tab.status === 'complete') {
          console.log('tab.status');
          chrome.tabs.executeScript(newWindow.tabs[0].id, {
            file: `scanSinglePostScript.bundle.js`,
          });

          chrome.tabs.onUpdated.removeListener(listener);
        }
      };

      chrome.tabs.onUpdated.addListener(listener);
    });
  };

  const scanPostsList = async () => {
    chrome.storage.local.clear();

    let loginUserData = JSON.parse(localStorage.getItem('loginUserData'));
    if (!loginUserData?.id) {
      setIsError(true);
      setAlertMessage(`syncd faild try again`);
      return;
    }

    var winObj = {
      url: `https://m.facebook.com/${loginUserData.id}?post_count=${numberOfPost}`,
      width: 400,
      height: 800,
      focused: true,
      type: 'popup',
      state: 'normal',
    };
    await db.table('post').clear();

    chrome.windows.create(winObj, async function (newWindow) {
      setScanPostListModal(false);
      const listener = (tabId, changeInfo, tab) => {
        const url = new URL(tab.url);
        if (tab.status === 'complete') {
          console.log('tab.status');
          chrome.tabs.executeScript(newWindow.tabs[0].id, {
            file: `scanPostListScript.bundle.js`,
          });
          chrome.tabs.onUpdated.removeListener(listener);
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
    });
  };

  const scanPostsActionBulk = async () => {
    chrome.storage.local.clear();

    let loginUserData = JSON.parse(localStorage.getItem('loginUserData'));
    if (!loginUserData?.id) {
      setIsError(true);
      setAlertMessage(`syncd faild try again`);
      return;
    }

    const selectedPostLinks = selectedPosts?.map((id) => {
      return `https://m.facebook.com/story.php?story_fbid=${id}&id=${loginUserData.id}`;
    });

    var winObj = {
      url: `https://m.facebook.com/${loginUserData.id}?post_count=${selectedPostLinks.length}`,
      width: 400,
      height: 800,
      focused: true,
      type: 'popup',
      state: 'normal',
    };
    // await db
    //   .table('friend')
    //   .where('active')
    //   .equals(1)
    //   .modify({ active: 1, like_count: 0, comment_count: 0 });

    // await db
    //   .table('friend')
    //   .where('active')
    //   .equals(0)
    //   .modify({ active: 1, like_count: 0, comment_count: 0 });

    chrome.storage.sync.set(
      { selectedPostLinks: selectedPostLinks },
      function () {
        chrome.windows.create(winObj, async function (newWindow) {
          // console.log(newWindow);
          setScanPostModal(false);

          const listener = (tabId, changeInfo, tab) => {
            const url = new URL(tab.url);
            if (tab.status === 'complete') {
              console.log('tab.status');
              chrome.tabs.executeScript(newWindow.tabs[0].id, {
                file: `scanPostActionBulkScript.bundle.js`,
              });

              chrome.tabs.onUpdated.removeListener(listener);
            }
          };

          chrome.tabs.onUpdated.addListener(listener);
        });
      }
    );
  };

  const handleTabChanged = (type) => {
    setTab(type);
    setSearchQuery('');
    // setCurrentPage(0);
  };

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
    fetchAllFriends(selectedPage);
  };

  let pathPrev = React.createElement(
    'path',
    {
      d:
        'M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z',
      fillRule: 'evenodd',
      clipRule: 'evenodd',
    },
    null
  );

  let prevIcon = React.createElement(
    'svg',
    {
      class: 'w-5 h-5 ',
      fill: 'currentColor',
      stroke: 'currentColor',
      viewBox: '0 0 20 20',
      xmlns: 'http://www.w3.org/2000/svg',
      ariaHidden: 'true',
    },
    pathPrev
  );
  let pathNext = React.createElement(
    'path',
    {
      d:
        'M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z',
      fillRule: 'evenodd',
      clipRule: 'evenodd',
    },
    null
  );

  let nextIcon = React.createElement(
    'svg',
    {
      class: 'w-5 h-5 ',
      fill: 'currentColor',
      stroke: 'currentColor',
      viewBox: '0 0 20 20',
      xmlns: 'http://www.w3.org/2000/svg',
      ariaHidden: 'true',
    },
    pathNext
  );

  const style = {
    tabButtonCount:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-600 text-white ml-1 ',
  };
  const [dropdown, setDropdown] = useState(false);

  return (
    <>
      <header className="px-4 flex justify-between items-center h-16 shadow-lg">
        <img class="inline object-contain  h-10" src={logo} alt="Profile ima" />
        <div className="flex">
          <div
            onClick={() => handleTabChanged('active-friends')}
            className={` text-gray-700 flex items-center justify-center text-base font-normal  cursor-pointer p-2 hover:bg-gray-200 rounded mx-2 ${
              tab === 'active-friends' && 'bg-gray-200 shadow-lg'
            }`}
          >
            Active{' '}
            <span className={style.tabButtonCount}> {friendsCount.active}</span>
          </div>
          <div
            onClick={() => handleTabChanged('in-active-friends')}
            className={` text-gray-700 flex items-center justify-center text-base font-normal  cursor-pointer p-2 hover:bg-gray-200 rounded mx-2 ${
              tab === 'in-active-friends' && 'bg-gray-200 shadow-lg'
            }`}
          >
            Inactive{' '}
            <span className={style.tabButtonCount}>
              {' '}
              {friendsCount.inactive}
            </span>
          </div>
          <div
            onClick={() => handleTabChanged('all-friends')}
            className={` text-gray-700 flex items-center justify-center text-base font-normal  cursor-pointer p-2 hover:bg-gray-200 rounded mx-2 ${
              tab === 'all-friends' && 'bg-gray-200 shadow-lg'
            }`}
          >
            All Friends{' '}
            <span className={style.tabButtonCount}>{friendsCount.all}</span>
          </div>
          <div
            onClick={() => handleTabChanged('white-lists')}
            className={` text-gray-700 flex items-center justify-center text-base font-normal  cursor-pointer p-2 hover:bg-gray-200 rounded mx-2 ${
              tab === 'white-lists' && 'bg-gray-200 shadow-lg'
            }`}
          >
            Whitelisted{' '}
            <span className={style.tabButtonCount}>
              {' '}
              {friendsCount.whitelisted}
            </span>
          </div>
          <div
            onClick={() => handleTabChanged('unfriended')}
            className={` text-gray-700 flex items-center justify-center text-base font-normal  cursor-pointer p-2 hover:bg-gray-200 rounded mx-2 ${
              tab === 'unfriended' && 'bg-gray-200 shadow-lg'
            }`}
          >
            Unfriended{' '}
            <span className={style.tabButtonCount}>
              {' '}
              {friendsCount.unfriended}
            </span>
          </div>
          <div
            onClick={() => handleTabChanged('posts')}
            className={` text-gray-700 flex items-center justify-center text-base font-normal  cursor-pointer p-2 hover:bg-gray-200 rounded mx-2 ${
              tab === 'posts' && 'bg-gray-200 shadow-lg'
            }`}
          >
            Posts{' '}
            <span className={style.tabButtonCount}> {friendsCount.posts}</span>
          </div>
        </div>
        <div className="flex items-center py-1  border-l ">
          <div class="relative inline-block text-left pl-2">
            <div>
              <div
                style={{
                  background:
                    'linear-gradient(90deg, rgba(0, 145, 234, 1) 0%, rgba(0, 191, 165, 1) 100%)',
                }}
                className={`text-white flex items-center justify-center text-sm  cursor-pointer px-4 py-2 rounded mx-2 hover:bg-blue-900`}
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true"
                onClick={() => setDropdown(!dropdown)}
              >
                Scan
                <svg
                  class="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {dropdown && (
              <div
                className={`border 
                 ${
                   !dropdown
                     ? 'transition ease-out duration-100 transform opacity-0 scale-95 transform opacity-100 scale-100'
                     : 'transition ease-in duration-75 transform opacity-100 scale-100 transform opacity-0 scale-95'
                 } origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none `}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabindex="-1"
              >
                <div class="py-1" role="none">
                  <a
                    onClick={() => {
                      checkFacebookAuth('all-friends-mbasic');
                      setIsSyncingScrapper(true);
                      setDropdown(!dropdown);
                    }}
                    href="#"
                    class="flex block w-full px-4 py-2 font-medium text-gray-700 whitespace-no-wrap hover:bg-gray-100 focus:outline-none hover:text-gray-900 focus:text-gray-900 focus:shadow-outline transition duration-300 ease-in-out"
                  >
                    {' '}
                    <svg
                      class="w-5 h-5 text-gray-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      ></path>
                    </svg>
                    Scan Friends (mobile)
                  </a>
                  <a
                    onClick={() => {
                      checkFacebookAuth('all-friends-scraper');
                      setIsSyncingScrapper(true);
                      setDropdown(!dropdown);
                    }}
                    href="#"
                    class="flex block w-full px-4 py-2 font-medium text-gray-700 whitespace-no-wrap hover:bg-gray-100 focus:outline-none hover:text-gray-900 focus:text-gray-900 focus:shadow-outline transition duration-300 ease-in-out"
                  >
                    {' '}
                    <svg
                      class="w-5 h-5 text-gray-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      ></path>
                    </svg>
                    Scan Friends
                  </a>
                  <a
                    onClick={() => {
                      setDropdown(!dropdown);
                      setScanPostListModal(true);
                    }}
                    href="#"
                    class="flex block w-full px-4 py-2 font-medium text-gray-700 whitespace-no-wrap hover:bg-gray-100 focus:outline-none hover:text-gray-900 focus:text-gray-900 focus:shadow-outline transition duration-300 ease-in-out"
                  >
                    {' '}
                    <svg
                      class="w-5 h-5 text-gray-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      ></path>
                    </svg>
                    Scan Post List
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      {isSyncingApi || isSyncingScraperNew || isSyncingScraper ? (
        <div class="bg-white border py-2 px-5 rounded-lg flex items-center flex-col mt-2">
          <div class="loader-dots block relative w-20 h-5 mt-2">
            <div class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
            <div class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
            <div class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
            <div class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div class="text-gray-500 text-base font-light mt-2 text-center">
            sync starded Please wait...
          </div>
        </div>
      ) : null}
      {isSyncSuccess || isSyncError ? (
        <div
          class={`
${isSyncSuccess ? ' bg-green-200 ' : isSyncError ? 'bg-red-200' : null}
px-6 py-2 mt-6  rounded-md text-base flex items-center mx-auto
`}
        >
          {isSyncSuccess ? (
            <svg viewBox="0 0 24 24" class="text-green-600 w-4 h-4  mr-3">
              <path
                fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
              ></path>
            </svg>
          ) : isSyncError ? (
            <svg viewBox="0 0 24 24" class="text-red-600 w-4 h-4 mr-3">
              <path
                fill="currentColor"
                d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
              ></path>
            </svg>
          ) : null}
          <span
            class={`
 ${isSyncSuccess ? '  text-green-800 ' : isSyncError ? ' text-red-800' : null}
`}
          >
            {alertMessage}{' '}
          </span>
        </div>
      ) : null}

      <main className="mx-auto container w-10/12 mt-4">
        <div className="bg-white shadow-lg rounded pb-4">
          <div
            className=" h-16 rounded-t flex items-center justify-between"
            style={{
              background:
                'linear-gradient(90deg, rgba(0, 145, 234, 1) 0%, rgba(0, 191, 165, 1) 100%)',
            }}
          >
            <div class=" flex items-center px-4">
              <span className="text-white text-base mx-2">
                Total Selected {tab === 'posts' ? 'Posts' : 'Friends'}{' '}
              </span>

              <span className="text-white text-base mx-2">
                {tab === 'posts'
                  ? selectedPosts.length
                  : selectedFriendList.length}
              </span>
            </div>

            <div class=" flex items-center  w-6/12 px-8 ">
              {/* <span className="text-white text-base mx-2">Search</span> */}
              <input
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // fetchAllFriends(currentPage);
                }}
                type="text"
                value={searchQuery}
                name="search"
                placeholder={
                  tab === 'posts' ? 'Search post id...' : 'Search Name...'
                }
                autocomplete="given-name"
                class="outline-none  h-10 w-full  rounded-l px-2"
              />
              <div
                onClick={() => {
                  // alert('...');

                  fetchAllFriends(currentPage);
                }}
                // style={{
                //   background:
                //     'linear-gradient(90deg, rgba(0, 145, 234, 1) 0%, rgba(0, 191, 165, 1) 100%)',
                // }}
                className={`text-white flex items-center justify-center text-sm   px-4 py-2 rounded-r  bg-blue-800 h-10 hover:bg-blue-900 cursor-pointer`}
              >
                <svg
                  class="w-5 h-5 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              {searchQuery !== '' && (
                <span
                  onClick={() => {
                    setSearchQuery('');
                    const _clear = true;
                    fetchAllFriends(currentPage, _clear);
                  }}
                  class="text-sm mx-2 text-white hover:text-gray-300 cursor-pointer"
                >
                  clear
                </span>
              )}
            </div>
          </div>
          {tab === 'posts' ? (
            <div className="mx-auto container  mt-4 flex items-center justify-center">
              <div
                onClick={() => {
                  if (!allSelected) {
                    setSelectedPosts(postsList.map((v) => v.id));
                    setAllSelected(true);
                  } else {
                    setSelectedPosts([]);
                    setAllSelected(false);
                  }
                }}
                className={`text-gray-700 flex items-center justify-center text-sm font-normal  cursor-pointer p-2 hover:bg-gray-200 mx-2`}
              >
                <svg
                  className="mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M7 7V3a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-4v3.993c0 .556-.449 1.007-1.007 1.007H3.007A1.006 1.006 0 0 1 2 20.993l.003-12.986C2.003 7.451 2.452 7 3.01 7H7zm2 0h6.993C16.549 7 17 7.449 17 8.007V15h3V4H9v3zm6 2H4.003L4 20h11V9zm-6.497 9l-3.536-3.536 1.414-1.414 2.122 2.122 4.242-4.243 1.414 1.414L8.503 18z"
                    fill="rgba(50,152,219,1)"
                  />
                </svg>
                Select all
              </div>
              <div
                onClick={() => {
                  if (selectedPosts.length === 0) {
                    // alert('No  friends selected yet!');
                  } else {
                    setSelectedPosts([]);
                    setAllSelected(false);
                  }
                }}
                className={`text-gray-700 flex items-center justify-center text-sm font-normal  cursor-pointer p-2 hover:bg-gray-200  mx-2`}
              >
                <svg
                  className="mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M5 20h14v2H5v-2zm7-2a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-2a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                    fill="rgba(149,164,166,1)"
                  />
                </svg>
                Select none
              </div>
              {selectedPosts.length > 0 && (
                <div
                  onClick={() => {
                    scanPostsActionBulk('scan-post-list');
                  }}
                  className={`text-gray-700 flex items-center justify-center text-sm font-normal  cursor-pointer p-2 hover:bg-gray-200  mx-2`}
                >
                  {' '}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="mr-1"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M5.671 4.257L13.414 12 12 13.414l-6.32-6.32a8 8 0 1 0 3.706-2.658L7.85 2.9A9.963 9.963 0 0 1 12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12a9.98 9.98 0 0 1 3.671-7.743z"
                      fill="rgba(230,126,34,1)"
                    />
                  </svg>
                  Post Scanner
                </div>
              )}
              <div
                onClick={() => {
                  checkFacebookAuth('scan-post');
                }}
                className={`text-gray-700 flex items-center justify-center text-sm font-normal  cursor-pointer p-2 hover:bg-gray-200  mx-2`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 2C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                    fill="rgba(155,89,182,1)"
                  />
                </svg>
                Scan all post
              </div>
            </div>
          ) : (
            <div className="mx-auto container  mt-4 flex items-center justify-center">
              <div
                onClick={() => {
                  if (!allSelected) {
                    setSelectedFriendsList(friendsList.map((v) => v));
                    setAllSelected(true);
                  } else {
                    // alert('you have alreadey  selected all friends in list!');
                    setSelectedFriendsList([]);
                    setAllSelected(false);
                  }
                }}
                className={`text-gray-700 flex items-center justify-center text-sm font-normal  cursor-pointer p-2 hover:bg-gray-200 mx-2`}
              >
                <svg
                  className="mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M7 7V3a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-4v3.993c0 .556-.449 1.007-1.007 1.007H3.007A1.006 1.006 0 0 1 2 20.993l.003-12.986C2.003 7.451 2.452 7 3.01 7H7zm2 0h6.993C16.549 7 17 7.449 17 8.007V15h3V4H9v3zm6 2H4.003L4 20h11V9zm-6.497 9l-3.536-3.536 1.414-1.414 2.122 2.122 4.242-4.243 1.414 1.414L8.503 18z"
                    fill="rgba(50,152,219,1)"
                  />
                </svg>
                Select all
              </div>
              <div
                onClick={() => {
                  if (selectedFriendList.length === 0) {
                    // alert('No  friends selected yet!');
                  } else {
                    setSelectedFriendsList([]);
                    setAllSelected(false);
                  }
                }}
                className={`text-gray-700 flex items-center justify-center text-sm font-normal  cursor-pointer p-2 hover:bg-gray-200  mx-2`}
              >
                <svg
                  className="mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M5 20h14v2H5v-2zm7-2a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-2a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                    fill="rgba(149,164,166,1)"
                  />
                </svg>
                Select none
              </div>
              <div
                onClick={() => {
                  if (selectedFriendList.length === 0) {
                    alert('No  friends selected yet!');
                  } else {
                    if (tab === 'white-lists') {
                      updateStatus('white-lists', 0);
                    } else {
                      updateStatus('white-lists', 1);
                    }
                  }
                }}
                className={`text-gray-700 flex items-center justify-center text-sm font-normal  cursor-pointer p-2 hover:bg-gray-200 mx-2`}
              >
                {tab === 'white-lists' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M3.783 2.826L12 1l8.217 1.826a1 1 0 0 1 .783.976v9.987a6 6 0 0 1-2.672 4.992L12 23l-6.328-4.219A6 6 0 0 1 3 13.79V3.802a1 1 0 0 1 .783-.976zM5 4.604v9.185a4 4 0 0 0 1.781 3.328L12 20.597l5.219-3.48A4 4 0 0 0 19 13.79V4.604L12 3.05 5 4.604zM12 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm-4.473 5a4.5 4.5 0 0 1 8.946 0H7.527z"
                      fill="rgba(230,126,34,1)"
                    />
                  </svg>
                ) : (
                  <svg
                    className="mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M3.783 2.826L12 1l8.217 1.826a1 1 0 0 1 .783.976v9.987a6 6 0 0 1-2.672 4.992L12 23l-6.328-4.219A6 6 0 0 1 3 13.79V3.802a1 1 0 0 1 .783-.976zM5 4.604v9.185a4 4 0 0 0 1.781 3.328L12 20.597l5.219-3.48A4 4 0 0 0 19 13.79V4.604L12 3.05 5 4.604zM12 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm-4.473 5a4.5 4.5 0 0 1 8.946 0H7.527z"
                      fill="rgba(47,204,113,1)"
                    />
                  </svg>
                )}
                {tab === 'white-lists'
                  ? 'Remove from white list'
                  : 'Add to white list'}
              </div>
              {tab !== 'white-lists' && (
                <div
                  onClick={() => {
                    if (selectedFriendList.length === 0) {
                      alert('No  friends selected yet!');
                    } else {
                      if (tab !== 'in-active-friends') {
                        updateStatus('active', 0);
                      } else {
                        updateStatus('active', 1);
                      }
                    }
                  }}
                  className={`text-gray-700 flex items-center justify-center text-sm font-normal  cursor-pointer p-2 hover:bg-gray-200  mx-2`}
                >
                  {tab !== 'in-active-friends' ? (
                    <svg
                      className="mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        d="M14 14.252v2.09A6 6 0 0 0 6 22l-2-.001a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm8 6h3v2h-3v3.5L15 18l5-4.5V17z"
                        fill="rgba(241,196,14,1)"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        d="M14 14.252v2.09A6 6 0 0 0 6 22l-2-.001a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm6 6v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z"
                        fill="rgba(25,188,155,1)"
                      />
                    </svg>
                  )}

                  {tab !== 'in-active-friends'
                    ? ' Add to InActive'
                    : ' Add to Active'}
                </div>
              )}

              {tab !== 'unfriended' && (
                <div
                  onClick={() => {
                    checkFacebookAuth('unfriend');
                  }}
                  className={`text-gray-700 flex items-center justify-center text-sm font-normal  cursor-pointer p-2 hover:bg-gray-200 mx-2`}
                >
                  <svg
                    className="mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M14 14.252v2.09A6 6 0 0 0 6 22l-2-.001a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm7 6.586l2.121-2.122 1.415 1.415L20.414 19l2.122 2.121-1.415 1.415L19 20.414l-2.121 2.122-1.415-1.415L17.586 19l-2.122-2.121 1.415-1.415L19 17.586z"
                      fill="rgba(231,76,60,1)"
                    />
                  </svg>
                  Unfriend
                </div>
              )}
            </div>
          )}

          <table class=" w-full mt-4">
            <thead class="bg-grey-light flex w-full">
              <tr class=" w-full mb-2 flex  bg-gray-200  border-b border-blue-400 ">
                {tab === 'posts' ? (
                  <>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider  w-1/4">
                      {' '}
                      Post Id
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-1/4">
                      {' '}
                      title
                    </th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider  w-1/4">
                      {' '}
                      View Post
                    </th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider  w-1/4">
                      {' '}
                      Scan Post
                    </th>
                  </>
                ) : (
                  <>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider  w-1/4">
                      {' '}
                      Name
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider  w-1/4">
                      {' '}
                      User ID
                    </th>
                    {tab !== 'unfriended' && (
                      <>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider  w-1/4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path
                              d="M14.6 8H21a2 2 0 0 1 2 2v2.104a2 2 0 0 1-.15.762l-3.095 7.515a1 1 0 0 1-.925.619H2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h3.482a1 1 0 0 0 .817-.423L11.752.85a.5.5 0 0 1 .632-.159l1.814.907a2.5 2.5 0 0 1 1.305 2.853L14.6 8zM7 10.588V19h11.16L21 12.104V10h-6.4a2 2 0 0 1-1.938-2.493l.903-3.548a.5.5 0 0 0-.261-.571l-.661-.33-4.71 6.672c-.25.354-.57.644-.933.858zM5 11H3v8h2v-8z"
                              fill="rgba(52,72,94,1)"
                            />
                          </svg>
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider  w-1/4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path
                              d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455zm-.692-2H20V5H4v13.385L5.763 17zM11 10h2v2h-2v-2zm-4 0h2v2H7v-2zm8 0h2v2h-2v-2z"
                              fill="rgba(52,72,94,1)"
                            />
                          </svg>
                        </th>
                      </>
                    )}
                  </>
                )}
              </tr>
            </thead>
            <tbody
              class="bg-grey-200 flex flex-col items-center  overflow-y-scroll w-full"
              style={{
                height: '42em',
              }}
              id="mc__div__scroll"
            >
              {/* postsList */}
              {tab === 'posts' ? (
                postsList?.length > 0 ? (
                  <>
                    <TablePost
                      searchQuery={searchQuery}
                      data={postsList}
                      handleSelectePost={handleSelectePost}
                      selectedPosts={selectedPosts}
                      scanSinglePost={scanSinglePost}
                    />
                  </>
                ) : (
                  <div className="h-8">No Result Found</div>
                )
              ) : friendsList ? (
                <Table
                  searchQuery={searchQuery}
                  data={friendsList}
                  handleSelectedFriends={handleSelectedFriends}
                  selectedFriendList={selectedFriendList}
                  isUnFriend={tab === 'unfriended' ? true : false}
                />
              ) : (
                <div className="h-8">No Result Found</div>
              )}
            </tbody>
          </table>

          <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <a
                href="#"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href="#"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </a>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  {totalFriends > 0 && (
                    <>
                      Showing
                      <span class="font-medium ml-1">
                        {currentPage * PER_PAGE + 1}
                      </span>
                      -
                      <span class="font-medium mx-1">
                        {Math.min(
                          currentPage * PER_PAGE + PER_PAGE,
                          totalFriends
                        )}
                      </span>
                      out of
                    </>
                  )}
                  <span class="font-medium mx-1">{totalFriends}</span>
                  result
                </p>
              </div>
              <div>
                <ReactPaginate
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={' shadow-sm flex justify-center'}
                  pageClassName={
                    'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center  border text-sm font-medium'
                  }
                  // pageLinkClassName={'pageNumberLink'}
                  pageLinkClassName={' px-4 py-2'}
                  previousClassName={
                    'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
                  }
                  // previousLinkClassName={'previousPageLink'}
                  nextClassName={
                    'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
                  }
                  // nextLinkClassName={'nextPageLink'}
                  activeClassName={
                    'z-10 bg-blue-100 border-blue-500 text-blue-900  border'
                  }
                  breakLinkClassName={'pageBreak'}
                  // previousLabel={nextIcon}
                  previousLabel={prevIcon}
                  nextLabel={nextIcon}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Modal
        open={unfriendModal}
        onClose={() => {
          setRemoveFriends([]);
          setUnfriendModal(false);
        }}
      >
        <h1 className="text-black text-base">Remove Friends</h1>
        {/* <h2 className="text-base text-gray-500 ">Total Ffriends to remove :{removeFriends?.length}</h2> */}
        <h2 className="text-sm text-gray-900 mt-6">
          Selelct a delay between each friend removing
        </h2>
        <select
          onChange={(e) => setDelayRemove(e.target.value)}
          className="p-2 mt-4 mb-6 w-full rounded appearance-none outline-none shadow-outline text-sm text-gray-800 bg-blue-100"
        >
          <option value="">select delay time</option>
          <option value="10000">10 seconds</option>
          <option value="20000">20 seconds</option>
          <option value="30000">30 seconds</option>
        </select>
        <br></br>
        <button
          className="bg-blue-800 border-none p-2 mt-2 text-white rounded w-full hover:bg-blue-900 text-sm "
          onClick={() => startRemoveFriends()}
        >
          Continue
        </button>
      </Modal>
      <Modal open={scanPostModal} onClose={() => setScanPostModal(false)}>
        <h1 className="text-black text-base">Scan Post</h1>
        {/* <h2 className="text-base text-gray-500 ">Total Ffriends to remove :{removeFriends?.length}</h2> */}
        <h2 className="text-sm text-gray-900 mt-6">
          Enter number of post to scan :{numberOfPost} (max 100)
        </h2>
        {/* <select
          onChange={(e) => setNumberOfPost(e.target.value)}
          className="p-2 mt-4 mb-6 w-full rounded appearance-none outline-none shadow-outline text-sm text-gray-800 bg-blue-100"
        >
          <option value="">select a post count</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select> */}

        <input
          type="number"
          className="p-2 mt-4 mb-6 w-full rounded appearance-none outline-none shadow-outline text-sm text-gray-800 bg-blue-100"
          onChange={(e) =>
            setNumberOfPost(e.target.value > 100 ? 100 : e.target.value)
          }
        />
        <br></br>
        <button
          className="bg-blue-800 border-none p-2 mt-2 text-white rounded w-full hover:bg-blue-900 text-sm "
          onClick={() => scanPosts()}
        >
          Continue
        </button>
      </Modal>

      <Modal
        open={scanPostListModal}
        onClose={() => setScanPostListModal(false)}
      >
        <h1 className="text-black text-base">Scan Post List</h1>
        {/* <h2 className="text-base text-gray-500 ">Total Ffriends to remove :{removeFriends?.length}</h2> */}
        <h2 className="text-sm text-gray-900 mt-6">
          Enter number of post listto scan :{numberOfPost} (max 100)
        </h2>

        <input
          type="number"
          className="p-2 mt-4 mb-6 w-full rounded appearance-none outline-none shadow-outline text-sm text-gray-800 bg-blue-100"
          onChange={(e) =>
            setNumberOfPost(e.target.value > 100 ? 100 : e.target.value)
          }
        />
        <br></br>
        <button
          className="bg-blue-800 border-none p-2 mt-2 text-white rounded w-full hover:bg-blue-900 text-sm "
          onClick={() => scanPostsList()}
        >
          Continue
        </button>
      </Modal>
    </>
  );
};

export default AddCampaign;

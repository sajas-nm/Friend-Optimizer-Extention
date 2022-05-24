import React, { useEffect, useState } from 'react';
import logo from '../../assets/img/logo.svg';
import '../../styles/tailwind.css';
import db from '../../db';

const SyncFrinds = () => {
  const [isSuccess, setISSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  useEffect(() => {
    let to = new URLSearchParams(window.location.search).get('to');
    console.log('to=>', to);
    startSync(to);
    chrome.runtime.onMessage.addListener(listener);
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);
  const listener = (request) => {
    if (request.message === 'syc-new-friends') {
      setIsSyncing(false);
      console.log('request', request.payload);
      if (request?.success) {
        console.log('request?.payload', request?.payload);
        setISSuccess(true);
        setAlertMessage(
          `You have sucessfully syncd ${request?.payload?.length} friends`
        );
      } else {
        setIsError(true);
        setAlertMessage(`Syncd faild try again`);
      }
      // setTimeout(() => {
      //   setISSuccess(false);
      //   setIsError(false);
      //   setAlertMessage('');
      // }, 3000);
    }
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
    setIsSyncing(true);

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
  return (
    <div className="App">
      <div class="w-screen flex justify-center items-center">
        <div
          class="card flex flex-col justify-center p-4 bg-white rounded-lg shadow-2xl mt-8"
          style={{
            width: '500px',
          }}
        >
          <div class="prod-title">
            <img
              alt="MC-Logo"
              src={logo}
              class="w-48 object-cover object-center mb-8 mx-auto"
            />

            {isSyncing && (
              <div class="bg-white border py-2 px-5 rounded-lg flex items-center flex-col mt-2">
                <div class="loader-dots block relative w-20 h-5 mt-2">
                  <div class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
                  <div class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
                  <div class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
                  <div class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div class="text-gray-500 text-base font-light mt-2 text-center">
                  <p class="uppercase text-sm text-red-400 mt-4">
                    please don't close this tab
                  </p>
                  Syncing New Frinds - Please Wait
                </div>
              </div>
            )}
            {isSuccess || isError ? (
              <div
                class={`
      ${isSuccess ? ' bg-green-200 ' : isError ? 'bg-red-200' : null}
      px-6 py-1 mx-1 my-1  mb-4 rounded-md text-base flex items-center  flex-col
      `}
              >
                <div className="flex items-center">
                  {isSuccess ? (
                    <svg
                      viewBox="0 0 24 24"
                      class="text-green-600 w-4 h-4  mr-3"
                    >
                      <path
                        fill="currentColor"
                        d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                      ></path>
                    </svg>
                  ) : isError ? (
                    <svg viewBox="0 0 24 24" class="text-red-600 w-4 h-4 mr-3">
                      <path
                        fill="currentColor"
                        d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
                      ></path>
                    </svg>
                  ) : null}
                  <span
                    class={`
                  ${
                    isSuccess
                      ? '  text-green-800 '
                      : isError
                      ? ' text-red-800'
                      : null
                  }
                  `}
                  >
                    {alertMessage}
                  </span>
                </div>
                {isError && (
                  <p class="text  text-gray-600 font-bold mt-4">
                    make sure your are login to your facebook account
                  </p>
                )}
              </div>
            ) : null}
            {/* <>
              <p class="uppercase text-sm text-red-400 mt-4">
                please don't close this tab
              </p>
              <div class="flex justify-between bg-gray-200 my-2 py-4 px-4">
                <p class="text uppercase text-gray-600 font-bold">
                  Syncing New Frinds - Please Wait
                </p>
              </div>
            </> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncFrinds;

import React, { useState, useEffect } from 'react';
import './styles.css';
import Tabs from '../utils/tabs';
import Login from '../Login';

const AppComponent = ({ view }) => {
  const [isAuthenticated, setAuth] = useState(false);

  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem('fr_data')));

    setAuth(localStorage.getItem('token'));
  }, [isAuthenticated]);

  return (
    <div
      class=" w-full"
      style={{
        height: '576px',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {isAuthenticated ? (
        <>
          <Tabs
            // tabs={[
            //   { name: 'Campign', i: 0 },
            //   // { name: 'Messages', i: 1 },
            // ]}
            // selectedTab={selectedTab}
            // setTab={(tabId) => {
            //   setSelectedTab(tabId);
            // }}
            setAuth={setAuth}
          />
          <main class="bodyWrapper flex-1 flex flex-col transition duration-500 ease-in-out overflow-y-auto">
            <div className="flex justify-evenly flex-wrap    h-64 items-center flex-col">
              <p className="py-2 text-blue-900 w-full text-lg px-4 bg-gray-100">
                Hello,{` `}
                {JSON.parse(localStorage.getItem('fr_data'))?.data?.fullName}
              </p>
              <button
                onClick={() => {
                  window.open(chrome.runtime.getURL('manageFriend.html'));
                }}
                type="button"
                class=" flex items-center border border-teal-700   text-teal-500 rounded-md px-3  py-2  transition duration-500 ease select-none hover:text-white hover:bg-teal-600 focus:outline-none focus:shadow-outline text-base"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
                  ></path>
                </svg>
                Open Dashboard
              </button>
            </div>
          </main>
        </>
      ) : (
        <Login setAuth={setAuth} />
      )}
    </div>
  );
};

export default AppComponent;

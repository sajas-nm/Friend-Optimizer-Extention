import React from 'react';
import LogoMC from '../../assets/img/logo-light.svg';
import exit from '../../assets/img/exit.svg';
import db from '../../db';
function Tabs({ tabs, selectedTab, setTab, setAuth }) {
  const [show, setstate] = React.useState(false);

  const clearAttributesTable = async () => {
    try {
      await db.table('attribute').clear();
    } catch (error) {
      console.error('Error', error);
    }
  };

  return (
    <div className="flex justify-between __ff-nav-bg">
      <nav class="flex sm:flex-row ">
        <div>
          <img
            class="inline object-contain  h-10"
            style={{
              margin: '4px 0px',
            }}
            src={LogoMC}
            alt="Profile "
          />
        </div>
        {/* {tabs.map((tab, i) => {
          return (
            <button
              onClick={() => {
                setTab(tab.i);
              }}
              class={`text-white mx-2 py-4 px-2 block hover:text-white-300 focus:outline-none ${
                i === selectedTab
                  ? 'text-white-500 border-b-2 font-medium border-white-500'
                  : ''
              }`}
            >
              {tab.name}
            </button>
          );
        })} */}
      </nav>

      <div>
        <button
          type="submit"
          class="block w-full text-left px-2 py-4 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
          role="menuitem"
          onClick={() => {
            clearAttributesTable();
            localStorage.clear();
            setAuth(false);
          }}
        >
          <img
            style={{
              background: 'transparent',
              height: '22px',
            }}
            alt=""
            src={exit}
          />
        </button>
      </div>
    </div>
  );
}

export default Tabs;

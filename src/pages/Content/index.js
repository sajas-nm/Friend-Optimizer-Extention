// console.log('[CS Running on FR =>>]');

const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const runContent = async () => {
  // console.log('run contrent');

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  if (localStorage.getItem('fr-clear-and-close')) {
    console.log('clearing and closing tab', localStorage.getItem('fr-data'));
    localStorage.removeItem('fr-clear-and-close');
    const _friend_id = localStorage.getItem('fr-data');
    localStorage.removeItem('fr-data');

    // console.log(_friend_id, '_friend_id');
    await new Promise((yay) => setTimeout(yay, 3000));
    chrome.runtime.sendMessage(
      {
        message: 'remove-friend-callback',
        success: true,
        friend_id: _friend_id,
      },
      () => { }
    );
  } else {
    // console.log('No operations found to execute in FR...');
    // chrome.runtime.sendMessage(
    //   {
    //     message: 'continue-process',
    //   },
    //   () => {}
    // );
  }

  if (params.mbasic_scraper_fr === 'true') {


    // append layout

    const layout = document.createElement('div');
    layout.style = `
      height: 100%;
      width: 100%;
      background-color: #6771b3;
      position: absolute;
      opacity: 0.8;
      margin: auto;
      text-align: center;
      padding-top: 40%;
      font-size: 24px;
    `

    layout.innerText = "Scraping Friends - Do not close this tab";

    await delay(1000);

    document.querySelector('body').prepend(layout);

    console.log("mbasic scraper..! gonna kill it");

    await delay(3000);

    const profiles = Array.from(document.querySelectorAll("div.w > table.m")).map(t => {
      return {
        profile_image: t.querySelector('img').src,
        id: t.querySelector('a').href?.includes('/profile.php') ? t.querySelector('a').href.split('id=')[1]?.split('&')[0] : t.querySelector('a').href?.split('?')[0]?.split('/')[3],
        name: t.querySelector('a').innerText,
        first_name: t.querySelector('a').innerText?.split(' ')[0],
        last_name: t.querySelector('a').innerText?.split(' ')[1]
      }
    })

    const nextPage = document.querySelector('#m_more_friends > a');

    if (nextPage) {
      chrome.runtime.sendMessage(
        {
          message: 'mbasic-collect-friends',
          friendList: profiles
        }
      );
      await delay(1000);
      window.location = nextPage.href + "&mbasic_scraper_fr=true"
    } else {
      await delay(1000);
      chrome.runtime.sendMessage(
        {
          closeMbasic: true,
        }
      );
    }
  }
};

runContent();

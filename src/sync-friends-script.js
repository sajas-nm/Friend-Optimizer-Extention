async function sync() {
  console.log(' running - from MC');
  try {
    let executeScript = new URLSearchParams(window.location.search).get(
      'mcAutomated'
    );
    const type = new URLSearchParams(window.location.search).get('type');
    if (executeScript !== 'true') {
      return;
    }
    console.log('[automated by MC - hence, progressing]');
    //pop up

    const popupDivContainer = document.createElement('div');
    // height: 300px;
    popupDivContainer.style = `
    width: 400px;
    background: #f0f2f5;
    position: fixed;
    border-radius: 10px;
    z-index: 100;
    bottom: 40px;
    left: 40px;
    display: flex;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    justify-content: space-between;
    flex-direction: column;`;

    //top div
    const headerContainer = document.createElement('div');
    headerContainer.style = `
    display: flex;
    background: linear-gradient(90deg, #0091ea 0%, #00bfa5 100%);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 15px;   
    justify-content: center;
    `;
    const title = document.createElement('h3');
    title.innerText = 'Friend Optimizer';
    title.style = `
    color:#fff;
    font-size:18px;
    font-weight: bold;

    `;

    headerContainer.appendChild(title);
    // headerContainer.appendChild(loader);

    //middle div
    const divContent = document.createElement('div');
    divContent.style = `
     height:'100%'
    `;

    divContent.innerHTML = `
    <div style="display:flex;align-items: center;
    justify-content: center;
    padding: 20px;
    flex-direction: column
    
    ">
     <span 
    style="font-size: 16px;text-transform: uppercase; color: #484646;" >
     Total friends found: <span id="totalFriendsMC">0</span> 
     </span>
   
  </div>
  <ul  
  style="list-style-type: square;
  font-size: 15px;
  color: #F44336;
  padding: 10px 62px;
  text-transform: capitalize;"
  >
    <li style="padding:10px 0;">Dont Change the tab</li>
    <li>Do not click anything else</li>
  </ul>

  <div id="messageTextMC" style="text-align: center;">
  
  </div>

      `;

    //bottom div
    const buttonContainer = document.createElement('div');
    buttonContainer.style = `
    padding: 15px;
    justify-content: space-evenly;
    align-items: center;
    display: flex;
    `;
    const buttonScrollMore = document.createElement('button');
    buttonScrollMore.innerText = 'Scroll More..';
    buttonScrollMore.className = 'buttonMC';
    buttonScrollMore.style = `
    border: none;
    background: #FFC107;
    padding: 8px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 15px;
    `;
    const buttonFinish = document.createElement('button');
    buttonFinish.innerText = 'Finish';
    buttonFinish.className = 'buttonMC';
    buttonFinish.style = `
    border: none;
    background: #2196F3;
    padding: 8px;
    border-radius: 5px;
    cursor: pointer;
    color: #fff;
    font-size: 15px;
    `;
    buttonContainer.appendChild(buttonScrollMore);
    buttonContainer.appendChild(buttonFinish);

    popupDivContainer.appendChild(headerContainer);
    popupDivContainer.appendChild(divContent);
    popupDivContainer.appendChild(buttonContainer);
    document.body.appendChild(popupDivContainer);

    await scrollToBottom();
    // console.log('>>', document.querySelector('[aria-label="Friends"]'));
    await new Promise((yay) => setTimeout(yay, 2000));
    buttonScrollMore.addEventListener('click', () => {
      scrollToBottom();
    });
    buttonFinish.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        payload: getAllFriends(),
        message: 'syc-new-friends',
        success: true,
        type: type,
      });
    });
  } catch (e) {
    console.error('error', e);
    chrome.runtime.sendMessage({ message: 'syc-new-friends' });
  }
}

setTimeout(() => {
  sync();
}, 3000);

const getAllFriends = () => {
  let _friendsList = [];
  let allFrindsEle = document.querySelectorAll('div[aria-label="Friends"]');
  console.log('allFrindsEle', allFrindsEle.length);
  allFrindsEle.forEach((v) => {
    let finalData = {};
    let parentElem = v.parentElement.parentElement.parentElement.parentElement;

    // console.log(
    //   '🚀 ~ file: sync-friends-script.js ~ line 22 ~ parentElem ',
    //   parentElem
    // );

    finalData.name =
      parentElem.querySelector('div:nth-child(2) a[tabindex="0"]')?.innerText ||
      '';

    let profileLink = parentElem.querySelector(
      'div:nth-child(2) a[tabindex="0"]'
    )?.href;
    let newprofileURL;
    let userID;
    if (profileLink) {
      console.log('profileLink', profileLink);
      newprofileURL = new URL(profileLink);
      userID =
        newprofileURL?.search !== ''
          ? getJsonFromUrl(newprofileURL?.search).id
          : undefined;
      if (userID) {
        finalData.id = userID;
      } else {
        const splits = newprofileURL?.pathname?.split('/') || [];
        userID = splits[splits.length - 1];
        finalData.id = userID;
      }
    }
    finalData.profile_image = parentElem.querySelector('img').src;
    _friendsList.push(finalData);
  });
  let currentFriendsList = _friendsList
    .map((v) => {
      if (v?.id) {
        return v;
      }
    })
    .filter((f) => f);

  console.log(
    '🚀 ~ file: sync-friends-script.js ~ line 18 ~ ab ~ profileLink',
    currentFriendsList
  );
  return currentFriendsList;
};

const scrollToBottom = async () => {
  document.getElementById('messageTextMC').innerHTML = `
  <span>
  <svg
    version="1.1"
    id="loader-1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    width="40px"
    height="25px"
    viewBox="0 0 40 40"
    enable-background="new 0 0 40 40"
    xml:space="preserve"
  >
    <path
      opacity="0.2"
      fill="#333"
      d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
  s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
  c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
    />
    <path
      fill="#0091ea"
      d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
  C22.32,8.481,24.301,9.057,26.013,10.047z"
    >
      <animateTransform
        attributeType="xml"
        attributeName="transform"
        type="rotate"
        from="0 20 20"
        to="360 20 20"
        dur="1s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
</span>
  `;
  Array.from(document.querySelectorAll('.buttonMC')).forEach((el) => {
    el.setAttribute('disabled', 'true');
  });
  while (
    document.documentElement.scrollHeight -
    window.scrollY -
    window.innerHeight >
    0
  ) {
    window.scrollBy(0, 200);
    let friendList = getAllFriends();
    console.log('scrollToBottom', friendList);
    document.querySelector('#totalFriendsMC').innerText = friendList.length;
    await new Promise((y) => setTimeout(y, 2000));
  }
  Array.from(document.querySelectorAll('.buttonMC')).forEach((el) => {
    el.removeAttribute('disabled');
  });
  document.getElementById('messageTextMC').innerHTML = `
  <p  style="
  
  padding: 10px 20px;
  font-size: 14px;
  text-align: center;
  background: #2196f324;
  color: #3F51B5;
  letter-spacing: 1px;

  
  ">
    Help us get all your friends. If there are more friends, please click scroll
    more to collect all of them. Else click finish to scrape your friends
  </p>
  `;
};

const getJsonFromUrl = (urlSearch) => {
  console.log('urlSearch', urlSearch);

  var query = urlSearch?.substr(1);
  var result = {};
  if (query) {
    query.split('&').forEach((part) => {
      var item = part && part.split('=');
      result[item[0]] = decodeURIComponent(item[1]);
    });
  }
  return result;
};

// console.log(' running - from remove friend script');
async function sync() {
  try {
    if (window.location.origin === 'https://mbasic.facebook.com') {
      if (!document.querySelector('[id="frext-overlay"]')) {
        const popupDivContainer = document.createElement('div');
        popupDivContainer.id = 'frext-overlay';
        // height: 300px;
        popupDivContainer.style = `
        height: 100%;
        width: 100%;
        top: 0;
        background: rgb(50 110 117 / 59%);
        background: linear-gradient( 
    90deg
     , rgb(0, 145, 234) 0%, rgb(0, 191, 165) 100%);
        position: absolute;
        z-index: 100;
        display: flex;
        box-shadow: rgb(0 0 0 / 19%) 0px 10px 20px, rgb(0 0 0 / 23%) 0px 6px 6px;
        justify-content: center;
        flex-direction: column;
        user-select: none;
        `;

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
        <?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
<g transform="translate(80,50)">
<g transform="rotate(0)">
<circle cx="0" cy="0" r="6" fill="#ffffff" fill-opacity="1">
  <animateTransform attributeName="transform" type="scale" begin="-0.875s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
  <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.875s"></animate>
</circle>
</g>
</g><g transform="translate(71.21320343559643,71.21320343559643)">
<g transform="rotate(45)">
<circle cx="0" cy="0" r="6" fill="#ffffff" fill-opacity="0.875">
  <animateTransform attributeName="transform" type="scale" begin="-0.75s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
  <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.75s"></animate>
</circle>
</g>
</g><g transform="translate(50,80)">
<g transform="rotate(90)">
<circle cx="0" cy="0" r="6" fill="#ffffff" fill-opacity="0.75">
  <animateTransform attributeName="transform" type="scale" begin="-0.625s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
  <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.625s"></animate>
</circle>
</g>
</g><g transform="translate(28.786796564403577,71.21320343559643)">
<g transform="rotate(135)">
<circle cx="0" cy="0" r="6" fill="#ffffff" fill-opacity="0.625">
  <animateTransform attributeName="transform" type="scale" begin="-0.5s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
  <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.5s"></animate>
</circle>
</g>
</g><g transform="translate(20,50.00000000000001)">
<g transform="rotate(180)">
<circle cx="0" cy="0" r="6" fill="#ffffff" fill-opacity="0.5">
  <animateTransform attributeName="transform" type="scale" begin="-0.375s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
  <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.375s"></animate>
</circle>
</g>
</g><g transform="translate(28.78679656440357,28.786796564403577)">
<g transform="rotate(225)">
<circle cx="0" cy="0" r="6" fill="#ffffff" fill-opacity="0.375">
  <animateTransform attributeName="transform" type="scale" begin="-0.25s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
  <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.25s"></animate>
</circle>
</g>
</g><g transform="translate(49.99999999999999,20)">
<g transform="rotate(270)">
<circle cx="0" cy="0" r="6" fill="#ffffff" fill-opacity="0.25">
  <animateTransform attributeName="transform" type="scale" begin="-0.125s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
  <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.125s"></animate>
</circle>
</g>
</g><g transform="translate(71.21320343559643,28.78679656440357)">
<g transform="rotate(315)">
<circle cx="0" cy="0" r="6" fill="#ffffff" fill-opacity="0.125">
  <animateTransform attributeName="transform" type="scale" begin="0s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
  <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="0s"></animate>
</circle>
</g>
</g>
<!-- [ldio] generated by https://loading.io/ --></svg>
         <span
        style="font-size: 16px;text-transform: uppercase; color: #fff;" >
          Removing Friends: <span id="totalFriendsMC"> ${0} / ${0} </span>
         </span>

      </div>
      <ul
      style="list-style-type: square;
      font-size: 15px;
      color: #FFFFFF;
      padding: 10px 62px;
      text-transform: capitalize;"
      >
        <li style="padding:10px 0;">Dont Change the tab</li>
        <li>Do not click anything else</li>
      </ul>

      <div id="messageTextMC" style="text-align: center;">

      </div>

          `;

        popupDivContainer.appendChild(headerContainer);
        popupDivContainer.appendChild(divContent);
        document.body.appendChild(popupDivContainer);
      }

      let fr_friends = new URLSearchParams(window.location.search).get(
        'fr_friends'
      );

      let delay = new URLSearchParams(window.location.search).get('delay');

      if (!localStorage.getItem('fr_friends_inital_render')) {
        const total_friends = JSON.parse(fr_friends).length;
        localStorage.setItem('fr_friends', fr_friends);
        localStorage.setItem('fr_friends_inital_render', '1');
        localStorage.setItem('fr_total_friends', total_friends); //+1
      }

      // update count
      if (document.querySelector('[id="totalFriendsMC"]')) {
        const _total_unfriends = JSON.parse(
          localStorage.getItem('fr_total_friends')
        );
        const remaining_friend = JSON.parse(localStorage.getItem('fr_friends'))
          .length;

        document.querySelector(
          '[id="totalFriendsMC"]'
        ).innerText = `${remaining_friend} / ${_total_unfriends}`;
      }

      if (document.querySelector('a[href^="/removefriend.php"]')) {
        await new Promise((yay) => setTimeout(yay, Number(2000)));
        localStorage.setItem("previousId", window.location.pathname.split('/')[1]);
        document.querySelector('a[href^="/removefriend.php"]').click();
      } else if (
        document.querySelector('[title="Remove Friend"]') ||
        document.querySelector('[title="Remove friend"]') ||
        document.querySelector('[title="remove friend"]')
      ) {

        if (window.location.search.includes('removed')) {
          let _friend_id = new URLSearchParams(window.location.search).get(
            'friend_id'
          );

          if (localStorage.getItem('previousId')) {
            _friend_id = localStorage.getItem('previousId');
            localStorage.removeItem("previousId")
          }


          const _friendsIds = JSON.parse(localStorage.getItem('fr_friends'));

          const _friends_after_removed = _friendsIds.filter(
            (id) => id !== _friend_id
          );

          console.log('after removed=>', _friends_after_removed);

          chrome.runtime.sendMessage(
            {
              message: 'remove-friend-callback',
              success: true,
              friend_id: _friend_id,
            },
            () => { }
          );

          console.log('here..1>');
          localStorage.setItem(
            'fr_friends',
            JSON.stringify(_friends_after_removed)
          );
          console.log('here..2>');

          if (_friends_after_removed.length === 0) {
            console.log('no more friends to remove');
            chrome.runtime.sendMessage({
              message: 'remove-friend-completed',
            });
            localStorage.clear();
          } else if (_friends_after_removed.length > 0) {
            // _friends_to_remove[0]
            console.log('going to remove another friend');
            await new Promise((yay) => setTimeout(yay, Number(delay)));
            // window.location.href = `https://mbasic.facebook.com/removefriend.php?friend_id=${_friends_after_removed[0]}`;
            window.location.href = isNaN(_friends_after_removed[0])
              ? `https://mbasic.facebook.com/${_friends_after_removed[0]}`
              : `https://mbasic.facebook.com/profile.php?id=${_friends_after_removed[0]}`
          }
        } else if (document.querySelector('input[name="confirm"]')) {
          await new Promise((yay) => setTimeout(yay, 1000));

          document.querySelector('input[name="confirm"]').click();
        }
      } else {
        //TODO handle if page broken or user block
        const _friends_after_removed = JSON.parse(
          localStorage.getItem('fr_friends')
        );
        const id = _friends_after_removed.splice(0, 1);
        console.log('after ', _friends_after_removed);
        localStorage.setItem(
          'fr_friends',
          JSON.stringify(_friends_after_removed)
        );
        // window.location.href = `https://mbasic.facebook.com/removefriend.php?friend_id=${_friends_after_removed[0]}`;
      }
    }
  } catch (e) {
    console.error('error', e);
    localStorage.clear();
    chrome.runtime.sendMessage({ message: 'remove-friend-completed' });
  }
}

setTimeout(() => {
  sync();
  console.log(' running - from remove friend script after load');
}, 2000);

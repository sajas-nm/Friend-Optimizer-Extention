let noNewComments = false;

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

const fetchComments = async () => {
  let totalComments;
  console.log('[fetchComments FR]');

  await new Promise((yay) => setTimeout(yay, 1000));
  document.querySelector('footer').scrollIntoView();
  await new Promise((yay) => setTimeout(yay, 500));

  let initComments = Array.from(
    document.querySelectorAll(`div[data-sigil="comment"]`)
  ).length;
  while (noNewComments === false) {
    let seeNext = document.querySelector(`[id*='see_next_'] > a`);
    let seePrevious = document.querySelector(`[id*='see_prev_'] > a`);

    if (seeNext) {
      seeNext.click();
      await new Promise((yay) => setTimeout(yay, 2000));
      window.scrollBy(0, 800);
      totalComments = Array.from(
        document.querySelectorAll(`div[data-sigil="comment"]`)
      )
        .map((e) => {
          const _comment = e.querySelector('div a');
          if (isValidHttpUrl(_comment.href)) {
            const _url = new URL(_comment.href);
            if (_url.pathname === '/profile.php') {
              return new URLSearchParams(_url.search).get('id');
            } else {
              return _url.pathname.replace('/', '');
            }
          }
        })
        .filter((a) => a);

      let allComments = Array.from(
        document.querySelectorAll(`div[data-sigil="comment"]`)
      ).length;

      if (allComments !== initComments) {
        initComments = allComments;
      } else {
        noNewComments = true;
      }
    } else if (seePrevious) {
      seePrevious.click();

      await new Promise((yay) => setTimeout(yay, 2000));
      totalComments = Array.from(
        document.querySelectorAll(`div[data-sigil="comment"]`)
      )
        .map((e) => {
          const _comment = e.querySelector('div a');
          if (isValidHttpUrl(_comment.href)) {
            const _url = new URL(_comment.href);
            if (_url.pathname === '/profile.php') {
              return new URLSearchParams(_url.search).get('id');
            } else {
              return _url.pathname.replace('/', '');
            }
          }
        })
        .filter((a) => a);
      let allComments = Array.from(
        document.querySelectorAll(`div[data-sigil="comment"]`)
      ).length;

      if (allComments !== initComments) {
        initComments = allComments;
      } else {
        noNewComments = true;
      }
    } else {
      await new Promise((yay) => setTimeout(yay, 2000));
      window.scrollBy(0, 800);
      totalComments = Array.from(
        document.querySelectorAll(`div[data-sigil="comment"]`)
      )
        .map((e) => {
          const _comment = e.querySelector('div a');
          if (isValidHttpUrl(_comment.href)) {
            const _url = new URL(_comment.href);
            if (_url.pathname === '/profile.php') {
              return new URLSearchParams(_url.search).get('id');
            } else {
              return _url.pathname.replace('/', '');
            }
          }
        })
        .filter((a) => a);
      noNewComments = true;
      break;
    }
  }
  return totalComments;
};

const fetchLikes = async () => {
  let noNewLikes;
  let like_profile;
  console.log('[fetchLikes] FR');
  await new Promise((yay) => setTimeout(yay, 1000));
  const viewLikesSelector = '[id^="sentence"] a';
  const seeMoreSelector = '[id^="reaction_profile_pager"] a';
  const likeProfilesSelector = '[id^="reaction_profile_browser"] [class^="item"]'; //container

  const viewLikesElement = document.querySelector(viewLikesSelector);
  if (viewLikesElement) {
    viewLikesElement.click();

    await new Promise((yay) => setTimeout(yay, 2000));
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((yay) => setTimeout(yay, 2000));
    while (!noNewLikes) {
      const seemore = document.querySelector(seeMoreSelector);
      console.log('seemore', seemore);
      if (seemore) {
        seemore.click();
        window.scrollBy(0, 800);
        await new Promise((yay) => setTimeout(yay, 3000));
      } else {
        window.scrollBy(0, 800);
        await new Promise((yay) => setTimeout(yay, 3000));
        // let likedProfileQS = '#reaction_profile_browser div[class^="item"]';
        if (!document.querySelector(likeProfilesSelector)) {
          console.log('Query selector Not Found!');
          // likedProfileQS = '#reaction_profile_browser1 div[class^="item"]';
        }

        like_profile = Array.from(
          document.querySelectorAll(likeProfilesSelector)
        )
          .map((v) => {
            if (v.querySelector('button[value="Message"]')) {
              const _link = v.querySelector('a');
              if (isValidHttpUrl(_link.href)) {
                const _url = new URL(_link.href);
                if (_url.pathname === '/profile.php') {
                  return new URLSearchParams(_url.search).get('id');
                } else {
                  return _url.pathname.replace('/', '');
                }
              }
            }
          })
          .filter((d) => d);
        noNewLikes = true;
        break;
      }
    }
    console.log({ like_profile });
    return like_profile;
  }
};

setTimeout(async () => {
  if (
    document.querySelector('[data-sigil="MBackNavBarClick"]')?.innerText ===
    'Content Not Found'
  ) {
    chrome.runtime.sendMessage({
      message: 'scand-post-action-compleated',
    });
    return;
  }

  //ADD UI - START
  var fixedBox = document.createElement('div');
  fixedBox.innerHTML = `
    <div style="font-family: 'Arial', sans-serif;color:#333;padding: 15px">
      <div>
        <h1 style="font-weight:800;font-size:2rem;padding-botton: 10px">Friend Optimizer</h1>
        <br />
        <h3>Friend Optimizer is scanning your post actions</h3>
        <br />
      </div>
      <br />

      <div style="text-align: center; margin: 3.5em 0;">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: rgb(255, 255, 255); display: block; shape-rendering: auto;" width="100" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <circle cx="84" cy="50" r="10" fill="#1d3f72">
        <animate attributeName="r" repeatCount="indefinite" dur="0.25s" calcMode="spline" keyTimes="0;1" values="10;0" keySplines="0 0.5 0.5 1" begin="0s"></animate>
        <animate attributeName="fill" repeatCount="indefinite" dur="1s" calcMode="discrete" keyTimes="0;0.25;0.5;0.75;1" values="#1d3f72;#71c2cc;#d8ebf9;#5699d2;#1d3f72" begin="0s"></animate>
      </circle><circle cx="16" cy="50" r="10" fill="#1d3f72">
      <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"></animate>
      <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"></animate>
      </circle><circle cx="50" cy="50" r="10" fill="#5699d2">
      <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.25s"></animate>
      <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.25s"></animate>
      </circle><circle cx="84" cy="50" r="10" fill="#d8ebf9">
      <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.5s"></animate>
      <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.5s"></animate>
      </circle><circle cx="16" cy="50" r="10" fill="#71c2cc">
      <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.75s"></animate>
      <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.75s"></animate>
      </circle>
      <!-- [ldio] generated by https://loading.io/ --></svg>
      </div>
    </div>
  `;
  fixedBox.style =
    'font-family: initial; padding: 0; font-size: 1.25em; display: block; position: fixed; top: 0; left: 0; z-index: 100000; width: 100%; height: 150vh; overflow:' +
    ' hidden; background: rgb(255, 255, 255); color: rgb(40, 62, 74);';
  document.body.appendChild(fixedBox);
  document.title = 'Feed Optimizer';

  var customScrollBar = document.createElement('style');
  customScrollBar.innerHTML = '::-webkit-scrollbar { width: 0px; }';
  document.body.style.overflowX = 'hidden';
  document.body.style.overflowY = 'hidden';
  document.head.appendChild(customScrollBar);

  // ADD UI - END
  const _comments_profiles = await fetchComments();

  await new Promise((yay) => setTimeout(yay, 1000));
  const _likes_profiles = await fetchLikes();
  chrome.runtime.sendMessage({
    message: 'scand-post-action-compleated',
    like_profiles: _likes_profiles,
    comment_profiles: _comments_profiles,
  });
}, 2000);

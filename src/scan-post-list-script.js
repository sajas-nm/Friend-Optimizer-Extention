var _postLinks = [];
let isPostLinkCompleted = false;

const fetchPostLinks = async (totalpost) => {
  let initaialPostLength = Array.from(
    document.querySelectorAll('.story_body_container')
  )
    .map((art) => {
      if (art.querySelector('div[data-sigil^="feed_story_ring"]')) {
        if (art.querySelector('div[data-sigil^="feed_story_ring"] > a')) {
          return {
            atrData: art
              .querySelector('div[data-sigil^="feed_story_ring"] > a')
              .getAttribute('data-click'),
            title: art.querySelector('p') && art.querySelector('p').innerText,
          };
        }
      }
    })
    .filter((f) => f).length;

  while (!isPostLinkCompleted) {
    if (_postLinks.length >= totalpost) {
      isPostLinkCompleted = true;
      break;
    }

    window.scrollBy(0, 8000);
    await new Promise((yay) => setTimeout(yay, 4000));

    _postLinks = Array.from(document.querySelectorAll('.story_body_container'))
      .map((art) => {
        if (art.querySelector('div[data-sigil^="feed_story_ring"]')) {
          if (art.querySelector('div[data-sigil^="feed_story_ring"] > a')) {
            return {
              atrData: art
                .querySelector('div[data-sigil^="feed_story_ring"] > a')
                .getAttribute('data-click'),
              title: art.querySelector('p') && art.querySelector('p').innerText,
            };
          }
        }
      })
      .filter((f) => f);

    const _currentPostLength = Array.from(
      document.querySelectorAll('.story_body_container')
    )
      .map((art) => {
        if (art.querySelector('div[data-sigil^="feed_story_ring"]')) {
          if (art.querySelector('div[data-sigil^="feed_story_ring"] > a')) {
            return {
              atrData: art
                .querySelector('div[data-sigil^="feed_story_ring"] > a')
                .getAttribute('data-click'),
              title: art.querySelector('p') && art.querySelector('p').innerText,
            };
          }
        }
      })
      .filter((f) => f).length;
    if (_postLinks.length <= totalpost) {
      if (document.querySelector('#fr_total_cc')) {
        document.querySelector('#fr_total_cc').innerHTML = _postLinks.length;
      }
    }

    if (initaialPostLength !== _currentPostLength) {
      initaialPostLength = _currentPostLength;
    } else {
      isPostLinkCompleted = true;
    }
  }
  _postLinks.length = totalpost;
  return _postLinks;
};

setTimeout(async () => {
  const post_count =
    new URLSearchParams(window.location.search).get('post_count') || 9;

  // ADD UI - START
  var fixedBox = document.createElement('div');
  fixedBox.innerHTML = `
    <div style="font-family: 'Arial', sans-serif;color:#333;padding: 15px">
      <div>
        <h1 style="font-weight:800;font-size:2rem;padding-botton: 10px">Friend Optimizer</h1>
        <br />
        <h3>Friend Optimizer is scanning your posts</h3>
        <br />
      </div>
      <div>Total posts to scan <span style="background:#2c3e50;color:#fff;border-radius:4px;padding:4px">${post_count}</span></div>
      <br />
      <div> Collected Post: <span ce-data-name="totalReacted" style="background:blue;color:#fff;border-radius:4px;padding:4px" id="fr_total_cc">0</span></div>

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

  await new Promise((yay) => setTimeout(yay, 1000));

  const _postLinks = await fetchPostLinks(post_count);
  if (document.querySelector('#fr_total_cc')) {
    document.querySelector('#fr_total_cc').innerHTML = _postLinks.filter(
      (f) => f.atrData
    ).length;
  }
  await new Promise((yay) => setTimeout(yay, 1000));
  chrome.runtime.sendMessage({
    message: 'scand-post-list',
    payload: _postLinks.filter(Boolean),
  });
}, 2000);

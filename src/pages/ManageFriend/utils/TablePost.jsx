import React from 'react';

const TablePost = ({
  data,
  handleSelectePost,
  selectedPosts,
  scanSinglePost,
}) =>
  data.map((f) => (
    <tr
      onClick={() => {
        handleSelectePost(f.id);
      }}
      class={`flex w-full border-b cursor-pointer hover:bg-gray-100  ${
        selectedPosts.includes(f.id) ? 'bg-blue-100 hover:bg-gray-100' : ''
      }`}
      key={f.id}
    >
      <td
        class={`px-4  py-2 whitespace-nowrap w-1/4     ${
          selectedPosts.includes(f.id) ? 'border-teal-500 border-l-4' : ''
        }`}
      >
        <div class="text-sm text-gray-900">{f?.id}</div>
        {/* <div class="text-sm text-gray-500">{f?.id}</div> */}
      </td>
      <td class="px-4  py-2 whitespace-nowrap  w-1/4">
        <div class="text-sm text-gray-900 truncate w-64">{f?.title}</div>
      </td>
      <td class="px-4  py-2 whitespace-nowrap  w-1/4 text-center">
        <div class="text-sm text-blue-900 flex items-center justify-center">
          <a
            href="#"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://m.facebook.com/${f.id}`);
            }}
          >
            <svg
              class="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
          </a>
        </div>
      </td>
      <td class="px-4  py-2 whitespace-nowrap w-1/4">
        <div class="text-sm  flex items-center justify-center">
          <svg
            onClick={(e) => {
              e.stopPropagation();
              scanSinglePost(f.id);
            }}
            class="w-6 h-6 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"
            ></path>
          </svg>
        </div>
      </td>
    </tr>
  ));
export default TablePost;

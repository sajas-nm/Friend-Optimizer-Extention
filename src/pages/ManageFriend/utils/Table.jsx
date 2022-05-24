import React from 'react';

const Table = ({
  data,
  isUnFriend,
  handleSelectedFriends,
  selectedFriendList,
  searchQuery,
}) =>
  data
    // .filter((f) => f?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()))
    .map((f) => (
      <tr
        onClick={() => {
          if (!isUnFriend) {
            handleSelectedFriends(f);
          }
        }}
        class={`flex w-full border-b cursor-pointer hover:bg-gray-100  ${
          selectedFriendList.some((v) => v.id === f.id)
            ? 'bg-blue-100 hover:bg-gray-100'
            : ''
        }`}
        key={f.id}
      >
        <td
          class={`px-4  py-2 whitespace-nowrap w-1/4     ${
            selectedFriendList.some((v) => v.id === f.id)
              ? 'border-teal-500 border-l-4'
              : ''
          }`}
        >
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10">
              <img
                class="h-10 w-10 rounded-full"
                src={f?.base64Profile || f?.profile_image}
                alt=""
              />
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">{f?.name}</div>
            </div>
          </div>
        </td>
        <td class="px-4  py-2 whitespace-nowrap w-1/4">
          <div class="text-sm text-gray-900">{f?.username}</div>
          <div class="text-sm text-gray-500">{f?.id}</div>
        </td>
        {!isUnFriend && (
          <>
            <td class="px-4  py-2 whitespace-nowrap w-1/4">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {f?.like_count || 0}
              </span>
            </td>
            <td class="px-4  py-2 whitespace-nowrap w-1/4">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {f?.comment_count || 0}
              </span>
            </td>
          </>
        )}
      </tr>
    ));
export default Table;

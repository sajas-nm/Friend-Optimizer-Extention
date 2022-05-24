import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import db from '../../db';

export default function Login({ setAuth, setAttr }) {
  const [{ username, password }, setUserData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState();
  const [err, setErr] = useState({ un: '', pw: '' });

  const [isLoading, setLoading] = useState(false);

  const handleLogin = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUserData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const validation = () => {
    let valid = true;
    let formError = {};
    if (username === '') {
      formError.un = "user name can't be empty";
      valid = false;
    }
    if (password === '') {
      formError.pw = "password can't be empty";
      valid = false;
    }
    setErr(formError);
    return valid;
  };
  const login = async () => {
    // let formData = new FormData();
    // formData.append('name', username);
    // formData.append('password', password);
    // formData.append('signIn', true);
    var urlencoded = new URLSearchParams();
    urlencoded.append('userEmail', username);
    urlencoded.append('userPassword', password);
    urlencoded.append('signIn', 'true');
    urlencoded.append('appVersion', '1');

    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlencoded,
    };
    try {
      // https://automatics.one/ext/v2/fr/auth/pro
      setLoading(true);
      const fetchResponse = await fetch(
        `https://automatics.one/ext/v2/fr/auth/pro`,
        settings
      );
      if (!fetchResponse.ok) throw Error(fetchResponse.message);
      const data = await fetchResponse.json();
      console.log('🚀 ~ file: index.jsx ~ line 66 ~ login ~ data', data);
      if (data.processSucceed) {
        let finalData = {};
        data.attrs.forEach((v) => {
          finalData[v.name] = v.value;
        });
        //         attrs: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
        // currentPlan: [1]
        // fullName: "203"
        // licenseValid: true
        // message: "Sign in successful"
        // processSucceed: true
        console.log(
          '🚀 ~ file: index.jsx ~ line 69 ~ data.data.attrs.forEach ~ data',
          data
        );
        setLoading(false);
        localStorage.setItem('token', true);
        localStorage.setItem('attr', JSON.stringify(data.attrs));
        delete data.attrs;
        console.log("🚀 ~ file: index.jsx ~ line 98 ~ login ~ data", data)
        localStorage.setItem(
          'fr_data',
          JSON.stringify({
            data,
          })
        );
        setAuth(true);
        // chrome.runtime.sendMessage({
        //   message: 'check_auth',
        // });
        return data;
      }
      setError('invalid user name or password');
      throw Error('somthing wend wrong!');
    } catch (e) {
      setError('invalid user name or password');
      console.error(e);
      setLoading(false);
      return e;
    }
  };

  // const login = async () => {
  //   const settings = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //   };

  //   try {
  //     setLoading(true);
  //     // https://automatics.one/ext/v2/fr/auth/pro
  //     const fetchResponse = await fetch(
  //       `https://automatics.one/ext/v2/fr/auth/pro/${username}/${password}`,
  //       settings
  //     );
  //     console.log('fetchResponse=>', fetchResponse);
  //     if (!fetchResponse.ok) throw Error(fetchResponse.message);
  //     const data = await fetchResponse.json();
  //     console.log(data);
  //     if (data?.http_code === 200) {
  //       console.log('fetchResponse data=>', data);
  //       let finalData = {};
  //       data.attrs.forEach((v) => {
  //         finalData[v.name] = v.value;
  //       });
  //       finalData['id'] = 1;
  //       setLoading(false);
  //       localStorage.setItem('token', true);
  //       await db.table('attribute').add(finalData);
  //       // localStorage.setItem('attr', JSON.stringify(finalData));
  //       setAuth(true);

  //       return data;
  //     }
  //     console.log('here data=>', data);
  //     setError('invalid user name or password');
  //     throw Error('somthing wend wrong!');
  //   } catch (e) {
  //     setError('invalid user name or password');
  //     console.error(e);
  //     setLoading(false);
  //     return e;
  //   }
  // };
  return (
    <div>
      <div class="container mx-auto">
        <div class="px-6 mt-20">
          <div class="">
            <img
              className="m-auto"
              style={{
                maxHeight: '56px',
              }}
              src={logo}
              alt="Logo"
            />
          </div>
          <div class="px-16 w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none">
            <h3 class="pt-4 text-2xl text-center">Welcome Back!</h3>
            {error && (
              <p class="text-red-600 text-sm text-center mt-2 bg-gray-300 rounded py-2 mx-6">
                {error}
              </p>
            )}

            <form
              class="px-6 pt-6 pb-8 mb-4 bg-white rounded"
              onSubmit={(e) => {
                e.preventDefault();
                if (validation()) {
                  login();
                }
              }}
            >
              <div class="mb-4">
                <label
                  class="block mb-2 text-sm font-bold text-gray-700"
                  for="username"
                >
                  {' '}
                  Username{' '}
                </label>
                <input
                  class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="username"
                  name="username"
                  value={username}
                  type="text"
                  placeholder="Enter username"
                  onChange={handleLogin}
                />
                {err?.un && <p class="text-red-600 text-xm  mt-1">{err?.un}</p>}
              </div>
              <div class="mb-4">
                <label
                  class="block mb-2 text-sm font-bold text-gray-700"
                  for="password"
                >
                  {' '}
                  Password{' '}
                </label>
                <input
                  class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  placeholder="Enter password"
                  onChange={handleLogin}
                />
                {err?.pw && <p class="text-red-600 text-xm  mt-1">{err?.pw}</p>}
              </div>

              <div class="mb-6 text-center">
                <button
                  class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

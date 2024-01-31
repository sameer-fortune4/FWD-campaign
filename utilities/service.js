// const validateResponse = (apiData) => {
//   if (typeof apiData == "undefined") {
//     return {
//       status: false,
//       error: "unauthorized",
//     };
//   }
//   return apiData;
// };

export async function getData(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': "application/json"
    }
  })
  const data = await response.json()
  return data
}

export async function postApiData(action, payload) {
  try {
    const response = await fetch(action, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow'
    });
    const data = await response.json();
    return data
  } catch (error) {
    console.log("object", error);
  }
}

export async function postRefreshToken(action, payload) {
  try {
    const response = await fetch(action, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });
    const data = await response.json();
    return data
  } catch (error) {
    console.log("object", error);
  }
}

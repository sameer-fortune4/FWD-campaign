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
  // console.log("datdatatstasd",await response.json());
  const data = await response.json()
  return data
  // return validateResponse(data);
}
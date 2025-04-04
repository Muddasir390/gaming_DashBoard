import config from "../config";

export const apisEndpoint = {
  loginURL: `${config.LOGIN_BASE_URL}/api/login`,
  activeUserURL: `${config.BASE_URL}/api/GetDailyActiveUsers`,
  getPostURL:`${config.BASE_URL}/api/getPosts`,
  addPostURL: `${config.BASE_URL}/api/newPost`,
  deletePostURL: `${config.BASE_URL}/api/deletePost`,
  singlePostURL:`${config.BASE_URL}/api/getPost`,
  updatePostURL: `${config.BASE_URL}/api/updatePost`,
  getFleetsURL: `https://35mimtdhtl.execute-api.eu-west-1.amazonaws.com/Test-A01/GetAliases`,
  updateFleetsURL : `https://35mimtdhtl.execute-api.eu-west-1.amazonaws.com/Test-A01/StartFleets`,
  allUsersURL: `${config.BASE_URL}/api/getUsersList`,
  userJourneyURL: `${config.BASE_URL}/api/events/`,
  virtaulStorePurchaseURL: `${config.BASE_URL}/api/getVirtualPurchases`,
  getSessionURL: `${config.BASE_URL}/api/averageSessionLength`,
  getUserCountURL: `${config.BASE_URL}/api/getUsersCount`,
  storePurchaseURL: `${config.BASE_URL}/api/getPurchases`,
  roomInfoURL: `${config.BASE_URL}/api/GetRoomsInfo`,
  specificUserDetailURL: `${config.BASE_URL}/api/users`







};

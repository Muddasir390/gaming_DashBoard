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
  allUsersURL: `http://ec2-63-33-169-21.eu-west-1.compute.amazonaws.com:8889/api/getUsersList`,
  userJourneyURL: `http://ec2-63-33-169-21.eu-west-1.compute.amazonaws.com:8889/api/events/`,
  virtaulStorePurchaseURL: `http://ec2-63-33-169-21.eu-west-1.compute.amazonaws.com:8889/api/getVirtualPurchases`,
  getSessionURL: `http://ec2-63-33-169-21.eu-west-1.compute.amazonaws.com:8889/api/averageSessionLength`,
  getUserCountURL: `http://ec2-63-33-169-21.eu-west-1.compute.amazonaws.com:8889/api/getUsersCount`,
  storePurchaseURL: `http://ec2-63-33-169-21.eu-west-1.compute.amazonaws.com:8889/api/getPurchases`





};

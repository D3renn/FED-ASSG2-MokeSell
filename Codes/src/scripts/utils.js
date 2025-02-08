export function checkUserLoggedIn() {
  let loginId = localStorage.getItem("loginId");
  if (loginId == undefined || loginId == "") {
    window.location.href = "/login/index.html"; // This redirects to login
  }
}
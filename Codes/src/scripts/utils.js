export function checkUserLoggedIn (){
  let loginId = localStorage.getItem("loginId");
  if(loginId == undefined || loginId == ""){
    window.location.href = "/login"; // This redirects to login
  }
}
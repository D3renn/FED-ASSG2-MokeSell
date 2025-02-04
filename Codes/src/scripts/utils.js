export function checkUserLoggedIn (){
  let loginId = localStorage.getItem("loginId");
  if(loginId == undefined || loginId == ""){
    window.location.href = "Login.html"; // This redirects to index.html
  }
}
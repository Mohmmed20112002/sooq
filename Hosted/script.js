
let burger = document.querySelector(".burger");
let navList = document.getElementById("navList");

burger.addEventListener("click", ()=> {
    navList.classList.toggle("show");
});
 let login_btn = document.querySelector(".login");
login_btn.addEventListener("click",()=>{
  location.href = "http://localhost/web_stor/login.html";
})
let web_select = document.getElementById("web");
web_select.addEventListener("change",()=>{
  if(web_select.value == "web_them"){
    localStorage.setItem("type","web_them.json");
    location.href = "http://localhost/web_stor/products.html";
  }else if(web_select.value == "web_side"){
     localStorage.setItem("type","web_side.json");
    location.href = "http://localhost/web_stor/products.html";
  }
})
let app_select = document.getElementById("app");
app_select.addEventListener("change",()=>{
  if(app_select.value == "appliction"){ 
   localStorage.setItem("type","appliction.json");
    location.href = "products.html";
  }else if(app_select.value == "code_app"){
    localStorage.setItem("type","app_code.json");
    location.href = "products.html";
  }
})
let logo = document.querySelector(".logo");
logo.addEventListener("click",()=>{
  location.href = "http://localhost/web_stor/index.html";
})
let li_1 = document.getElementById("li_1");
li_1.addEventListener("click",()=>{
  location.href = "http://localhost/web_stor/index.html";
})

let li_4 = document.getElementById("li_4");
li_4.addEventListener("click",()=>{
  location.href = "http://localhost/web_stor/index.html#request_info";
})

let li_5 = document.getElementById("li_5");
li_5.addEventListener("click",()=>{
  location.href = "http://localhost/web_stor/index.html#services";
})

let li_6 = document.getElementById("li_6");
li_6.addEventListener("click",()=>{
  location.href = "http://localhost/web_stor/index.html#contact";
})


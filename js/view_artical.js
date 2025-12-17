
let face_footer = document.querySelector(".face_footer");
let insta_footet = document.querySelector(".insta_footet");
let linkedin_footer = document.querySelector(".linkedin_footer");
let whats_footer = document.querySelector(".whats_footer");
let mail = document.querySelector(".mal_fo");
let phon_fo = document.querySelector(".phon_fo");
 const xhr = new XMLHttpRequest();
  xhr.open("GET", "php/json/social_links.json", true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      face_footer.href = data[0].link;
      insta_footet.href = data[1].link;
      linkedin_footer.href = data[2].link;
      mail.innerText = data[3].link;
      whats_footer.href = "https:\/\/wa.me\/" + data[4].link;
      phon_fo.href = "tel:" + data[4].link;
      phon_fo.innerText =  data[4].link;
    }
  };
  xhr.send();

let iframe = document.getElementById("iframe");
iframe.src = localStorage.getItem("read");
  
let burger = document.querySelector(".burger");
let navList = document.getElementById("navList");

burger.addEventListener("click", ()=> {
    navList.classList.toggle("show");
});
 let login_btn = document.querySelector(".login");
login_btn.addEventListener("click",()=>{
  location.href = "login.html";
})
let web_select = document.getElementById("web");
web_select.addEventListener("change",()=>{
  if(web_select.value == "web_them"){
    localStorage.setItem("type","web_them.json");
    location.href = "products.html";
  }else if(web_select.value == "web_side"){
     localStorage.setItem("type","web_side.json");
    location.href = "products.html";
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
  location.href = "index.html";
})
let li_1 = document.getElementById("li_1");
li_1.addEventListener("click",()=>{
  location.href = "index.html";
})

let li_4 = document.getElementById("li_4");
li_4.addEventListener("click",()=>{
  location.href = "index.html#request_info";
})

let li_5 = document.getElementById("li_5");
li_5.addEventListener("click",()=>{
  location.href = "index.html#services";
})

let li_6 = document.getElementById("li_6");
li_6.addEventListener("click",()=>{
  location.href = "index.html#contact";
})

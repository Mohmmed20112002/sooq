let Articles = document.querySelector(".Articles");

// الاتصال ب API
const xhr1 = new XMLHttpRequest();
xhr1.open("GET", `php/json/artical.json`, true);
xhr1.onload = function() {
  if (xhr1.status === 200) {
    const data = JSON.parse(xhr1.responseText);

    for (let i = 0; i < data.length; i++) {
      // إنشاء العناصر
      let article_card = document.createElement("div");
      article_card.classList.add("article_card");
      
      let title = document.createElement("div");
      title.classList.add("title");
      let p1 = document.createElement("p");
      p1.innerText = data[i].articale_date;

      let text = document.createElement("div");
      text.classList.add("text");

      let h3 = document.createElement("h3");
      h3.innerText = data[i].main_title; 

      let p = document.createElement("p");
      p.innerText = data[i].sub_title;

      let read = document.createElement("div");
      read.classList.add("read");

      let p2 = document.createElement("p");
      p2.innerText = "قراءة المقال";

      let icon = document.createElement("i");
      icon.classList.add("fa", "fa-arrow-right");

      // تركيب العناصر
      title.appendChild(p1);
      text.appendChild(h3);
      text.appendChild(p);
      read.appendChild(p2);
      read.appendChild(icon);

      // إضافة event عند الضغط على "قراءة المقال"
      read.addEventListener("click", () => {
        localStorage.setItem("read", data[i].article_link);
        window.open("view_artical.html");
      });

      article_card.appendChild(title);
      article_card.appendChild(text);
      article_card.appendChild(read);

      // إضافة البطاقة إلى الـ DOM مباشرة
      Articles.appendChild(article_card);
    }
  }
};
xhr1.send();

//navbar
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
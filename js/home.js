
let speed = document.getElementById("speed");
let securty = document.getElementById("securty");
let data = document.getElementById("data");
let host = document.getElementById("host");
let ai_web = document.getElementById("ai_web");
let ai_cv = document.getElementById("ai_cv");

speed.addEventListener("click",()=>{
  event.preventDefault();  
  window.location = "http://localhost/web_stor/speed/";
})
securty.addEventListener("click",()=>{
    event.preventDefault();  
    window.location = "http://localhost/web_stor/security/";

})

data.addEventListener("click",()=>{
      event.preventDefault();  
   window.location = "http://localhost/web_stor/Hosted";
})
// دالة عامة للدفع
function pay(serves) {
    fetch("php/pay.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `serves=${serves}`
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "success"){
            // تحويل المستخدم إلى رابط الدفع
            window.location.href = data.url;
            localStorage.setItem("payment","success");
        } else {
            alert(data.message);
        }
    });
}

// زر تصميم المواقع بالذكاء الصناعي
ai_web.addEventListener("click", (event) => {
    event.preventDefault();
    pay("AI_WEB");
});

// زر السيرة الذاتية
ai_cv.addEventListener("click", (event) => {
    event.preventDefault();
    pay("AI_CV");
});

//تفعيل روابط التواصل 
let email = document.getElementById("emi");
let number = document.getElementById("num");
let facebook = document.getElementById("i_4");
let insta = document.getElementById("i_5");
let linkedin = document.getElementById("i_6");
let watsapp = document.getElementById("i_7");
//footer
let face_footer = document.querySelector(".face_footer");
let insta_footet = document.querySelector(".insta_footet");
let linkedin_footer = document.querySelector(".linkedin_footer");
let whats_footer = document.querySelector(".whats_footer");
let mail = document.querySelector(".mal_fo");
let phon_fo = document.querySelector(".phon_fo");
 const xhr = new XMLHttpRequest();
  xhr.open("GET", `php/json/social_links.json?v=${Date.now()}`, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      facebook.href = data[0].link;
      face_footer.href = data[0].link;
      insta.href = data[1].link;
      insta_footet.href = data[1].link;
      linkedin.href = data[2].link;
      linkedin_footer.href = data[2].link;
      email.href = "mailto:" + data[3].link; 
      mail.href = "mailto:" + data[3].link; 
      email.innerText = data[3].link;
      mail.innerText = data[3].link;
      number.href = "tel:" + data[4].link;
      number.innerText = data[4].link;
      watsapp.href = "https:\/\/wa.me\/" + data[4].link;
      whats_footer.href = "https:\/\/wa.me\/" + data[4].link;
      phon_fo.href = "tel:" + data[4].link;
      phon_fo.innerText =  data[4].link;
      const phone = data[4].link; // رقمك الدولي بدون +
  const defaultMessage = encodeURIComponent("مرحباً ، أود الاستفسار عن ...");

  // مراجع لعناصر DOM
  const whBtn = document.getElementById("whBtn");
  const whCard = document.getElementById("whCard");
  const whOpen = document.getElementById("whOpen");
  const whQuick = document.getElementById("whQuick");

  // تهيئة روابط واتساب
  function getWhatsAppLink(message) {
    // يستخدم wa.me لفتح رقم مباشرة (يدعم تطبيق واتساب والويب)
    return `https://wa.me/${phone}?text=${message || ""}`;
  }
  // ربط رابط الزر "افتح المحادثة"
  whOpen.href = getWhatsAppLink(defaultMessage);

  // عند الضغط على الزر الدائري: إظهار/إخفاء البطاقة
  whBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    whCard.classList.toggle("show");
  });

  // زر رسالة سريعة: يفتح رابط يحتوي رسالة قصيرة
  whQuick.addEventListener("click", function () {
    window.open(getWhatsAppLink(defaultMessage), "_blank", "noopener");
  });

  // إغلاق البطاقة بالنقر في أي مكان خارجها
  document.addEventListener("click", function (e) {
    if (!whCard.contains(e.target) && !whBtn.contains(e.target)) {
      whCard.classList.remove("show");
    }
  });

  // الوصول من لوحة المفاتيح: إغلاق باستخدام ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") whCard.classList.remove("show");})

    }
  };
  xhr.send();
// قسم قوالب المواقع
function get(API,continer){
const xhr1 = new XMLHttpRequest();
xhr1.open("GET", `php/json/${API}?v=${Date.now()}`, true);
xhr1.onload = function() {
  if (xhr1.status === 200) {
    const data = JSON.parse(xhr1.responseText);
  for (let i = 0; i < data.length; i++) {
    if(data[i].page_link === "home_page"){
      let image1 = data[i].image1;
      image1 = image1.slice(0, -4) + "raw=1";
      
      const web_card = document.createElement("div");
      web_card.classList.add("web_card");

      const web_img = document.createElement("div");
      web_img.classList.add("web_img");

      const img = document.createElement("img");
      img.src = image1;

      const web_text = document.createElement("div");
      web_text.classList.add("web_text");

      const h3 = document.createElement("h3");
      h3.innerText = data[i].name;

      const p = document.createElement("p");
      p.classList.add("description");
      p.innerText = data[i].description;

      const web_bay = document.createElement("div");
      web_bay.classList.add("web_bay");

      const p_pay = document.createElement("p");
      p_pay.innerText = data[i].ification || "تجاري";
      p_pay.dataset.ification = data[i].ification || "تجاري";


      const span = document.createElement("span");
      span.innerText = data[i].price + "$";

      const button = document.createElement("button");
      button.classList.add("btn");
      button.innerText = "اشتري الآن";
      
    

      // تركيب العناصر
      web_img.appendChild(img);
      web_text.appendChild(h3);
      web_text.appendChild(p);
      web_bay.appendChild(p_pay);
      web_bay.appendChild(span);
      web_bay.appendChild(button);

      web_card.appendChild(web_img);
      web_card.appendChild(web_text);
      web_card.appendChild(web_bay);
      if(data[i].type == "not_active"){
          web_card.remove();
        }
      // إضافته للحاوية
      const web_container = document.getElementById(`${continer}`)
      web_container.appendChild(web_card);
      web_card.addEventListener("click",()=>{
        localStorage.setItem("view",data[i].code);
        localStorage.setItem("type",API);
        location.href = "product.html";
      })
    }

    }
  } 
};
xhr1.send();
}
get("web_them.json","web_them");
get("web_side.json","web_side");
get("app_code.json","app_code");
get("appliction.json","appliction");

function prodect (click, event){
  let link = document.querySelector(`.${click}`);
  link.addEventListener("click",()=>{
    localStorage.setItem("type",event);
    link.href = "products.html";
  })
}

prodect("appliction","appliction.json");
prodect("web_them","web_them.json");
prodect("web_side","web_side.json");
prodect("code_app","app_code.json");
//تفعيل nav
let li_1 = document.getElementById("li_1");//الرئيسيه
let app = document.getElementById("app");//التطبيقات
let web = document.getElementById("web");//مواقع

let login = document.querySelector(".login");
login.addEventListener("click",()=>{
  location.href = "login.html";
})
//تسجيل زياره 
window.onload = function(){
   const viset = {
         user: 1
        }
        const formData = new FormData();
        for(const key in viset){
          formData.append(key,viset[key]);
        }
        fetch("http://localhost/web_stor/php/viset.php",{
          method: "POST",
          body: formData
        })
}
//تفعيل الخدمات
let user = document.getElementById("name");
let tel = document.getElementById("tel");
let ail = document.getElementById("email");
let details = document.getElementById("details");
let service_type = document.getElementById("service_type");
let request_btn = document.querySelector(".request_btn");
request_btn.addEventListener("click",function(event){
  event.preventDefault();
  
   const data = {
         user_name: user.value,
         user_email: ail.value,
         tel_type: tel.value,
         description: details.value,
         service : service_type.value
        }
        const formData = new FormData();
        for(const key in data){
          formData.append(key,data[key]);
        }
        fetch("http://localhost/web_stor/php/service.php",{
          method: "POST",
          body: formData
        })
        .then(response=> response.text())
        .then(result =>{
          window.alert(result);
          
        })
        .catch(error =>{
          console.error("حدث خطا",error);
        })
    
})
//navebar
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

//مربع البحث
let select_serch = document.querySelector(".select_serch");
let serch = document.querySelector(".serch");
let serch_btn = document.querySelector(".serch_btn");
serch_btn.addEventListener("click",(e)=>{
  e.preventDefault();
  localStorage.setItem("serech",serch.value);
  localStorage.setItem("type",select_serch.value);
  location.href = "products.html";
})
//واصل معانا 
let contentus_btn = document.getElementById("contentus_btn");
let contentus_name = document.getElementById("contentus_name");
let contentus_email = document.getElementById("contentus_email");
let contentus_message = document.getElementById("contentus_message");
contentus_btn.addEventListener("click",(event)=>{
  event.preventDefault();
  const contect = {
    name: contentus_name.value,
    email: contentus_email.value,
    message: contentus_message.value 
  }
   const formData = new FormData();
        for(const key in contect){
          formData.append(key,contect[key]);
        }
        fetch("http://localhost/web_stor/php/contectus.php",{
          method: "POST",
          body: formData
        })
        .then(response=> response.text())
        .then(result =>{
          window.alert(result);
        })
        .catch(error =>{
          console.error("حدث خطا",error);
        })
})
let facebook = document.querySelector("#facebook");
let whatsapp = document.querySelector("#whatsapp");
let email = document.getElementById("email");


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
      facebook.addEventListener('click',()=>{window.open(data[0].link)});
      insta_footet.href = data[1].link;
      linkedin_footer.href = data[2].link;
      mail.innerText = data[3].link;
      email.href = data[3].link;
      whats_footer.href = "https:\/\/wa.me\/" + data[4].link;
      whatsapp.addEventListener('click',()=>{window.open("https:\/\/wa.me\/" + data[4].link)});
      phon_fo.href = "tel:" + data[4].link;
      phon_fo.innerText =  data[4].link;
    }
  };
  xhr.send();

  let title = document.getElementById("title");
let sub_title = document.getElementById("sub_title");
let price = document.getElementById("price");
let view = document.querySelector(".view");
let preview = document.querySelector(".preview");

const xhr1 = new XMLHttpRequest();
xhr1.open("GET", `php/json/${localStorage.getItem("type")}`, true);

xhr1.onload = function() {
  if (xhr1.status === 200) {
    const data = JSON.parse(xhr1.responseText);
    for (let i = 0; i < data.length; i++) {
        let number = Number(data[i].price);
        let increase = number * 0.10;
        let newNumber = number + increase;
        let image = document.getElementById("image");
        let name = document.getElementById("name");
        let type = document.getElementById("type");
        let price = document.getElementById("price");
        let total = document.getElementById("total");
        let seller = document.getElementById("seller");
        let prodect = document.getElementById("prodect");
        if(data[i].code === localStorage.getItem("view")){
          image.src = data[i].image1.slice(0, -4) + "raw=1";
          name.innerText = data[i].name;
          price.innerText = data[i].price;
          total.innerText = newNumber;
          seller.value = data[i].seller;
          prodect.value = data[i].code;

          if(localStorage.getItem("type") === "web_them.json"){
            type.innerText = "قالب موقع الكتروني";
          }else if(localStorage.getItem("type") === "web_side.json"){
            type.innerText = "ملكية موقع الكتروني";
          }else if(localStorage.getItem("type") === "app_code.json"){
            type.innerText = "كود تطبيق";
          }else if(localStorage.getItem("type") === "appliction.json"){
            type.innerText = "ملكية تطبيق";
          }
        }      
      
      }}}
      xhr1.send();
      let name_1 = document.getElementById("name_1");
      let name_2 = document.getElementById("name_2");
      let ail = document.getElementById("mail");
      let phone = document.getElementById("phone");
      let country = document.getElementById("country");
      let city = document.getElementById("city");
      let address = document.getElementById("address");
      let pay_btn = document.getElementById("pay_btn");
      pay_btn.addEventListener("click",(event)=>{
        event.preventDefault();
      if(name_1.value == ""){
        window.alert("ادخل الاسم الاول");
        name_1.style.border = "2px solid red";
        return;
      }else if(name_2.value == ""){
        window.alert("ادخل الاسم الثاني");
        name_2.style.border = "2px solid red";
        return;
      }else if(ail.value == ""){
        window.alert("ادخل الايميل");
        ail.style.border = "2px sloid red";
        return;
      }else if(phone.value == ""){
        window.alert("ادخل رقم الهاتف");
        phone.style.border = "2px solid red";
        return;
      }else if(country.value == ""){
        window.alert("ادخل الدوله");
        country.style.border = "2px solid red";
        return;
      }else if(city.value == ""){
        window.alert("ادخل المدينه");
        city.style.border = "2px solid red";
        return;
      }
const formData = new FormData();
formData.append("name", name_1.value + " " + name_2.value);
formData.append("email", ail.value);
formData.append("address", country.value + " " + city.value + " " + address.value);
formData.append("phon", phone.value);
formData.append("prodect", localStorage.getItem("view"));
formData.append("typ", localStorage.getItem("type").slice(0,-5));

fetch("http://localhost/web_stor/php/payment.php", {
    method: "POST",
    body: formData
})
.then(res => res.json())
.then(data => {
    if(data.status === "success"){
        window.location.href = data.url; // تحويل العميل لصفحة الدفع
    } else {
        alert("حدث خطأ: " + data.message);
    }
})
.catch(err => console.error(err));

})
let note = document.querySelector(".note");
let link = document.getElementById("link");
if (localStorage.getItem("downlode")!== null){
  link.href = localStorage.getItem("downlode").replace(/dl=0$/, "dl=1");
  link.innerText = "تم الحصول علي رابط التحميل قم بتحميل المنتج";
  note.style.backgroundColor = "rgba(255, 0, 0, 0.479)";
  link.addEventListener("click",()=>{
    localStorage.removeItem("downlode");
    location.reload(true); 
   })
}

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
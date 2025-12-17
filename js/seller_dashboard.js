// الازرار 
let home = document.getElementById("home");
let prodect = document.getElementById("prodect");
let set = document.getElementById("set");
//الصفحات
let home_page = document.getElementById("home_pag");
let prodect_page = document.getElementById("prodect_page");
let setting = document.querySelector(".setting");
home.addEventListener("click",()=>{
    prodect.classList.remove("active");
    set.classList.remove("active");
    home.classList.add("active");
    home_page.style.display = "flex";
    prodect_page.style.display = "none";
    setting.style.display = "none";
})
prodect.addEventListener("click",()=>{
    prodect.classList.add("active");
    set.classList.remove("active");
    home.classList.remove("active");
    home_page.style.display = "none";
    prodect_page.style.display = "flex";
    setting.style.display = "none";
})
set.addEventListener("click",()=>{
    prodect.classList.remove("active");
    set.classList.add("active");
    home.classList.remove("active");
    home_page.style.display = "none";
    prodect_page.style.display = "none";
    setting.style.display = "flex";
})
window.onload = function(){
    
const data = {
  user_email: localStorage.getItem("email"),
  account_type: localStorage.getItem("acount")
};

const formData = new FormData();
for (const key in data) {
  formData.append(key, data[key]);
}

fetch("http://localhost/web_stor/php/seller_dashboard.php", {
  method: "POST",
  body: formData
})
.then(response => response.text())
.then(result => {
    console.log("النص الكامل:", result);

    // استخراج code و wallet باستخدام Regex
    const codeMatch = result.match(/code:([^;]+)/);//الكود
    const walletMatch = result.match(/wallet:([^;]+)/);//المحفظه
    const nameMatch = result.match(/name:([^;]+)/);//الاسم
    const phoneMatch = result.match(/phone:([^;]+)/);//رقم الهاتف
    const pass = result.match(/password:([^;]+)/);//الباسورد
    const activet = result.match(/activet:([^;]+)/);//التفعيل

    if (codeMatch && walletMatch && nameMatch && phoneMatch) {
      const userCode = codeMatch[1];//الكود
      const userWallet = walletMatch[1];//المحفظه
      const username = nameMatch[1];//الاسم
      const userphone = phoneMatch[1];//رقم التلفون
      const userpassword = pass[1];//الباسورد
      const userActive = 	activet[1];
      //المدفوعات
      let paypal_mail = document.querySelector(".paypal_mail");
      let withdrawal = document.querySelector(".withdrawal");
      withdrawal.addEventListener("click",(event)=>{
        event.preventDefault();
        if(paypal_mail.value == ""){
          window.alert("ادخل ايميل حسابك علي pay pal ");
          paypal_mail.style.border = "2px solid red";
          return;
        }else if (userWallet == 0.00){
          window.alert("لا يوجد اي رصيد في محفظتك");
          return;
        }
        const payment_data = {
          SellerName : username,
          SellerCode : userCode,
          SellerPhone : userphone,
          SellerEmail : localStorage.getItem("email"),
          SellerPaypal : paypal_mail.value,
          SellerWallat : userWallet
        }
         const PaymentForm = new FormData();
        for(const key in payment_data){
          PaymentForm.append(key,payment_data[key]);
        }
        fetch("http://localhost/web_stor/php/Profits.php",{
          method: "POST",
          body: PaymentForm
        })
        .then(response=> response.text())
        .then(result =>{
          window.alert(result);
          console.log(result);
          
        })
        .catch(error =>{
          console.error("حدث خطا",error);
        })
      })
      //البيانات الشخصيه
      let data_name = document.getElementById("data_name");//اسم المستخدم
      data_name.value = username;
      let data_email = document.getElementById("data_email");//الايميل
      data_email.value = localStorage.getItem("email");
      let data_phon = document.getElementById("data_phon");//رقم التلفون
      data_phon.value = userphone;

      let btn_send = document.getElementById("btn_send");//ارسال البيانات

      let old_password = document.getElementById("old_password");//الباسورد القديم

      let new_password = document.getElementById("new_password");//الباسورد الجديد

      let new_password2 = document.getElementById("new_password2");//تاكيد الباسورد الجديد

      let send_pass = document.getElementById("send_pass");//ارسال الباسورد الجديد

      btn_send.addEventListener("click",(event)=>{
        event.preventDefault();
         const seller_data = {
         user_name: data_name.value,
         user_email: data_email.value,
         edit_type: "data",
         phone: data_phon.value,
         code: userCode,
        }
        const formData = new FormData();
        for(const key in seller_data){
          formData.append(key,seller_data[key]);
        }
        fetch("http://localhost/web_stor/php/EditSeller.php",{
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
      send_pass.addEventListener("click",(event)=>{
        event.preventDefault();
        if(userpassword == old_password.value && 
          new_password.value == new_password2.value
        ){ 
        const seller_pass = {
          edit_type: "pass",
          new_pass : new_password.value,
          code: userCode
        }
        const dataform = new FormData();
        for(const key in seller_pass){
          dataform.append(key,seller_pass[key]);
        }fetch("http://localhost/web_stor/php/EditSeller.php",{
          method: "POST",
          body: dataform
        })
        .then(response=> response.text())
        .then(result =>{
          window.alert(result);
          console.log(result);
          
        })
        .catch(error =>{
          console.error("حدث خطا",error);
        })
        }else{
          window.alert("خطا في كلمة المرور ");
        }
      })


      let wellet = document.querySelector(".wellet");
      wellet.innerText = userWallet + "$";
      let add_btn = document.querySelector(".add_btn");
      add_btn.addEventListener("click",()=>{
        if(userActive !== "active"){
          alert("حسابك غير مفعل جار التحقق من صحة بيانات الهويه عند التاكد من صحيتها سيتم تفعيل حسابك");
          return;
        }else{ 
        localStorage.setItem("code",userCode);
        location.href = "add_prodect.html";
        }
      })
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `php/json/prodectSale.json?v=${Date.now()}`, true);
      xhr.onload = function() {
      if (xhr.status === 200) {
      const dat = JSON.parse(xhr.responseText);
      for (let i = 0; i < dat.length; i++) {
        let prodect_sale = document.getElementById("prodect_sale");
        if(dat[i].seller_code == userCode){
          let tr = document.createElement("tr");
          let td_0 = document.createElement("td");
          td_0.innerText = i;

          let td_1 = document.createElement("td");
          td_1.innerText = dat[i].product_name;

          let td_2 = document.createElement("td");
          td_2.innerText = dat[i].created_at;

          let td_3 = document.createElement("td");
          td_3.innerText = dat[i].price;

          let td_4 = document.createElement("td");
          td_4.innerText = dat[i].profit;

          tr.appendChild(td_1);
          tr.appendChild(td_2);
          tr.appendChild(td_3);
          tr.appendChild(td_4);
          prodect_sale.appendChild(tr);

        }


}}}
xhr.send();
function json (API){ 
const xhr_1 = new XMLHttpRequest();
xhr_1.open("GET", `php/json/${API}.json?v=${Date.now()}`, true);
xhr_1.onload = function() {
if (xhr_1.status === 200) {
const dat = JSON.parse(xhr_1.responseText);
for (let i = 0; i < dat.length; i++) {
    let your_prodect = document.getElementById("your_prodect");
    if(dat[i].seller == userCode){
      let tr_1 = document.createElement("tr");

      let prodect_name = document.createElement("td");
      prodect_name.innerText = dat[i].name;
      
      let prodect_code = document.createElement("td");
      prodect_code.innerText = dat[i].code;

      let prodect_price = document.createElement("td");
      prodect_price.innerText = dat[i].price;

      let icon_edit = document.createElement("i");
      icon_edit.classList.add("fa-regular", "fa-pen-to-square");

      let edit = document.createElement("td");
      edit.appendChild(icon_edit);

      
     let td_5 = document.createElement("td")
     let icon = document.createElement("i");
     icon.className = "fa-solid fa-eye";
     td_5.appendChild(icon);
     td_5.addEventListener("click",()=>{
     localStorage.setItem("type",localStorage.getItem("prodect"));
     localStorage.setItem("view",dat[i].code);
     window.open("http://localhost/web_stor/product.html");
     })

      tr_1.appendChild(prodect_name);
      tr_1.appendChild(prodect_code);
      tr_1.appendChild(prodect_price);
      tr_1.appendChild(td_5);
      tr_1.appendChild(edit);
      let serct_data = document.querySelector(".serct_data");

      let serch_btn = document.querySelector(".serch_btn");

      serch_btn.addEventListener("click",()=>{
        if(dat[i].name.includes(serct_data.value) === true){
          tr_1.style.display = "table-row";
        }else{
          tr_1.style.display = "none";
        }
      })
      your_prodect.appendChild(tr_1);
      edit.addEventListener("click",()=>{
        localStorage.setItem("type","edit");
        localStorage.setItem("code" , dat[i].code);
        localStorage.setItem("seller",dat[i].seller);
        window.location = "add_prodect.html";
      })
      localStorage.setItem("prodect", API + ".json");
    }
}}}
xhr_1.send();
}
let them = document.getElementById("them");
let web = document.getElementById("web");
let app = document.getElementById("app");
let code = document.getElementById("code");
them.addEventListener("click",()=>{
  your_prodect.innerHTML = "";
  them.classList.add("li_active");
  web.classList.remove("li_active");
  app.classList.remove("li_active");
  code.classList.remove("li_active");
  json("web_them");
})
web.addEventListener("click",()=>{
  your_prodect.innerHTML = "";
  them.classList.remove("li_active");
  web.classList.add("li_active");
  app.classList.remove("li_active");
  code.classList.remove("li_active");
  json("web_side");
})
app.addEventListener("click",()=>{
  your_prodect.innerHTML = "";
  them.classList.remove("li_active");
  web.classList.remove("li_active");
  app.classList.add("li_active");
  code.classList.remove("li_active");
  json("appliction");
})
code.addEventListener("click",()=>{
  your_prodect.innerHTML = "";
  them.classList.remove("li_active");
  web.classList.remove("li_active");
  app.classList.remove("li_active");
  code.classList.add("li_active");
  json("app_code");
})

    } else if(result.includes("error:not_found")) {
      window.alert("المستخدم غير موجود");
    } else {
      console.error("لم يتم العثور على القيم المطلوبة في النص");
    }
})
.catch(error => {
  console.error("حدث خطأ أثناء جلب البيانات:", error);
});


}
let log_out = document.querySelector(".log_out");
log_out.addEventListener("click",()=>{
  location.href = "login.html";
})
//المدفوعات
let atr_web = document.querySelector(".atr_web");
let art_app = document.querySelector(".art_app");
atr_web.addEventListener("click",()=>{
  localStorage.setItem("read", "التنازل عن ملكية موقع");
  window.open("view_artical.html");
})
art_app.addEventListener("click",()=>{
  localStorage.setItem("read", "التنازل عن ملكية تطبيق");
        window.open("view_artical.html");
})
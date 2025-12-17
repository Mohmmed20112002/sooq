let password = document.getElementById("password");
let pass = document.getElementById("pass");
let btn = document.querySelector(".btn");
let view = document.querySelector(".view");
let acount = document.getElementById("acount");
let user = document.getElementById("name");
let email = document.getElementById("email");
let phon = document.getElementById("phone");
let seller_file = document.getElementById("seller_file");
let id_seller = document.querySelector(".id_seller");
acount.addEventListener("change", () => {
  if (acount.value === "seller") {
    id_seller.style.display = "flex";
    if(seller_file.files.length === 0){
    alert("اضف بطاقة هويته لتسجيل حساب البائع ");
    return;
  }

  } else {
    id_seller.style.display = "none";
  }
});


btn.addEventListener("click", (event) => {
  event.preventDefault();
   if (acount.value === "seller") {
    if(seller_file.files.length === 0){
    alert("اضف بطاقة هويته لتسجيل حساب البائع ");
    return;
  }
  
  } 
  if(password.value.length < 8){
    window.alert("يجب ان لا يقل الباسورد عن 8 احرف");
    return;
  }else if (user.value == ""){
    window.alert("ادخل اسمك الكامل");
    return
  }else if(email.value == ""){
    window.alert("ادخل الايميل الخاص بك");
    return;
  }else if(phon.value == ""){
    window.alert("ادخل رقم هاتفك");
    return;
  }
  if (password.value !== pass.value) {
    window.alert("كلمة المرور غير متطابقة");
    pass.style.border = "2px solid red";
    password.style.border = "2px solid red";
    return;
  } else if (acount.value === "acount") {
    window.alert("اختر نوع الحساب ");
    return;
  }
const data = {
  user_name: user.value,
  user_email: email.value,
  account_type: acount.value,
  phone: phon.value,
  password: pass.value
}

const formData = new FormData();

// إضافة البيانات النصية
for (const key in data) {
  formData.append(key, data[key]);
}

// إضافة الملف إذا تم اختياره
if (seller_file.files.length > 0) {
  formData.append('id_seller', seller_file.files[0]);
}

fetch("http://localhost/web_stor/php/Mail.php", {
  method: "POST",
  body: formData
})
.then(response => response.text())
.then(result => {
  window.alert(result);
  console.log(result);
})
.catch(error => {
  console.error("حدث خطأ", error);
});

    
});

view.addEventListener("change", () => {
  password.type = view.checked ? "text" : "password";
  pass.type = view.checked ? "text" : "password";
});

let pass = document.getElementById("passwoed");
let view_pass = document.getElementById("view_pass");
view_pass.addEventListener("click",()=>{
   pass.type = "text";
})

let email = document.getElementById("email");
let account_type = document.getElementById("account_type");
let submit = document.querySelector(".btn");
submit.addEventListener("click",(event)=>{
   event.preventDefault();
   if(account_type == "account"){
      window.alert("اختر نوع الحساب");
      return;
   }
   
   const data = {
         user_email: email.value,
         account_type: account_type.value,
         password: pass.value
        }
        const formData = new FormData();
        for(const key in data){
          formData.append(key,data[key]);
        }
        fetch("http://localhost/web_stor/php/login.php",{
          method: "POST",
          body: formData
        })
        .then(response=> response.text())
        .then(result =>{
          if(result == "seller"){
            localStorage.setItem("acount",result);
            localStorage.setItem("email",email.value);
            location.href = "http://localhost/web_stor/seller_dashboard.html";
          }else if(result == "freelancers"){
             localStorage.setItem("acount",result);
            localStorage.setItem("email",email.value);
            location.href = "http://localhost/web_stor/freelanser.html";
          }
          else{
            window.alert(result);
          }
          
        })
        .catch(error =>{
          console.error("حدث خطا",error);
        })
    
})

let reset_pass = document.querySelector(".reset_pass");
reset_pass.addEventListener("click",()=>{
  if(email.value == ""){
    window.alert("ادخل الايميل اولا");
    return;
  }else if(account_type.value == "account"){
    window.alert("اختر نوع الحساب");
  }
  const reset = {
         user_email: email.value,
         account_type: account_type.value,
        }
        const dataform = new FormData();
        for(const key in reset){
          dataform.append(key,reset[key]);
        }
        fetch("http://localhost/web_stor/php/reset.php",{
          method: "POST",
          body: dataform
        })
        .then(response=> response.text())
        .then(result =>{
          window.alert(result);
        })
        .catch(error =>{
          console.error("حدث خطا",error);
        })
})

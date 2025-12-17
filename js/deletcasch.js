(async function () {

  // إذا الصفحة تحتوي على ?nocache=1 لا تعمل إعادة تحميل مرة ثانية
  if (window.location.search.includes('nocache=1')) {
    return; 
  }

  // مسح Cache Storage فقط (الأهم لحذف JSON المخبأ)
  if ('caches' in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    console.log('Cache Storage cleared.');
  }

  // إعادة تحميل الصفحة مرة واحدة فقط
  const newUrl = window.location.origin + window.location.pathname + "?nocache=1";
  window.location.replace(newUrl);

})();
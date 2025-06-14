function validateForm() {
  if (!document.getElementById('name').value.trim()) {
    alert('נא למלא שם מלא');
    return false;
  }

  if (!document.getElementById('phone').value.trim()) {
    alert('נא למלא מספר טלפון');
    return false;
  }

  alert('ההזמנה נשלחה בהצלחה');
}

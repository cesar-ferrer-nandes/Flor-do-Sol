const form = document.getElementById("formContato");

form.addEventListener("submit", function(e){
  e.preventDefault();

  alert("Mensagem enviada com sucesso! 🌿");

  form.reset();
});
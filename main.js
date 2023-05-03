document.querySelector("#chanceDeCoisar").addEventListener("input", (event) => {
  document.querySelector("#chance").textContent = Math.round(parseFloat(event.target.value)*100) + "%"
})

function coisar() {
  const chance = document.querySelector("#chanceDeCoisar").value
  const mainText = $('#coisoDeTexto').val()
  let otherText = mainText
  const settings = {
    "url": "http://sobek.ufrgs.br/tools//freeling.php",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    "data": {
      "text": mainText
    }
  };

  $.ajax(settings).done(function (response) {
    const {sentences} = JSON.parse(response);
    let difference = 0
    sentences.forEach(({tokens}) => {
      tokens.forEach(token => {
        console.log(token);
        if (Math.random() >= chance) {
          console.log("pulou");
        }
        else {
          if (token.tag.startsWith('N')) {
            token.begin = parseInt(token.begin)
            token.end = parseInt(token.end)
            const palavra = substantivoAleatorio(token.gen, token.num)
            otherText = otherText.substring(0, (token.begin + difference)) + 
             palavra + 
             otherText.substring((token.end + difference), otherText.length);
             difference += palavra.length - token.form.length
          }
          // if (token.tag.startsWith('V')) {
          //   token.begin = parseInt(token.begin)
          //   token.end = parseInt(token.end)
          //   const palavra = verboAleatorio()
          //   otherText = otherText.substring(0, (token.begin + difference)) + 
          //    palavra + 
          //    otherText.substring((token.end + difference), otherText.length);
          //    difference += palavra.length - token.form.length
          // }
        }
      })
    });
    $("#coisoDeResultado").val(otherText)
  });
}

function substantivoAleatorio(genero = "", num = "") {
  if (genero == "masculine") {
    if (num == "plural") {
      var substantivos = ["coisos", "bagulhos", "negocios"]
    }
    if (num == "singular"){
      var substantivos = ["coiso", "bagulho", "negocio"]
    }
    return substantivos[Math.floor(Math.random()*substantivos.length)]; 
  }
  if (genero == "feminine") {
    if (num == "plural") {
      var substantivos = ["paradas", "coisas", "budegas"]
    }
    else {
      var substantivos = ["parada", "coisa", "budega"]
    }

    return substantivos[Math.floor(Math.random()*substantivos.length)]; 
  }
  else {
    const substantivos = ["coiso", "bagulho", "negocio"]
    return substantivos[Math.floor(Math.random()*substantivos.length)]; 
  }


}

function verboAleatorio() {
  const substantivos = ["coisar", "bagulhar", "negoçar"]
  return substantivos[Math.floor(Math.random()*substantivos.length)]; 
}
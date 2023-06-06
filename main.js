const range = document.querySelector("#chanceDeCoisar")
const rangeValueDiv = document.querySelector("#chance")
range.addEventListener("input", (event) => {
  rangeValueDiv.textContent = Math.round(parseFloat(event.target.value)*100) + "%"


})

let chance = 0
let mainText = $('#coisoDeTexto').val()
let otherText = mainText

const tiposDePalavras = {
  "noun_singular_feminine": ["parada", "coisa", "budega", "coisinha", "joça", "paradinha", "pixorrinha", "geringonça"],
  "noun_singular_masculine": ["coiso", "bagulho", "negócio", "treco", "troço", "trem", "bagulhete", "bagulhinho", "trambolho"],
  "noun_plural_feminine": ["paradas", "coisas", "budegas", "coisinhas", "joças", "geringonça"],
  "noun_plural_masculine": ["coisos", "bagulhos", "negócios", "trecos", "troços", "trem", "bagulhetes", "bagulhinhos"],
  "verb_gerund": ["coisando"]
}

function getPalavra(token) {
  let palavrasPorTipo 
  if (token.pos == "noun") {
    palavrasPorTipo = tiposDePalavras[`${token.pos}_${token.num}_${token.gen}`]
  }
  if (token.pos == "verb") {
    palavrasPorTipo = tiposDePalavras[`${token.pos}_${token.mood}`]
  }
  if (palavrasPorTipo)
    return getPalavraAleatoria(palavrasPorTipo)
  return undefined
}

function getPalavraAleatoria(palavras) {
  const indexAleatorio = Math.floor(Math.random()*palavras.length)
  return palavras[indexAleatorio]
}

function coisar() {
  mainText = $('#coisoDeTexto').val()
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

  $.ajax(settings).done(mudaPalavras);
}

const mostraResultado = () => $("#coisoDeResultado").val(otherText)

function mudaPalavras(response) {
  const { sentences } = JSON.parse(response);
  let diff = 0
  otherText = mainText
  chance = range.value
  sentences.forEach(({tokens}) => {
    tokens.forEach(token => {
      console.log(token)
      const passouDaChance = Math.random() < chance
      const palavra = getPalavra(token)
      if (passouDaChance && palavra) {
            const [begin, end] = [parseInt(token.begin), parseInt(token.end)]
            const antesDaPalavra = otherText.substring(0, begin + diff)
            const depoisDaPalavra = otherText.substring(end + diff, otherText.length) 
            otherText = antesDaPalavra + palavra + depoisDaPalavra;
            diff += palavra.length - token.form.length
        }
      }
    )
  mostraResultado()
  })
}
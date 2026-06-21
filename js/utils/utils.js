const ALL_TAGS = "ALL_TAGS";

const translations = {
    "SOBRE MIM" : "ABOUT ME",
    "INTERESSES" : "INTERESTS",
    "LÍNGUAS" : "LANGUAGES",
    "COMPETÊNCIAS" : "SKILLS",
    "HABILIDADES TÉCNICAS" : "TECHNICAL PROFICIENCIES",
    "OBJETIVO DE CARREIRA" : "CAREER  OBJECTIVE",
    "EXPERIÊNCIAS PROFISSIONAIS" : "PROFESSIONAL EXPERIENCES",
    "EDUCAÇÃO" : "EDUCATION",
    "CURSOS E CERTIFICADOS" : "COURSES AND CERTIFICATES",
    "Selecione os cursos pela tag": "Select courses by tags",
    "atualmente" : "currently",
    "Currículo" : "Resume",
    "Marcar todos" : "Select All",
    "Desmarcar todos" : "Unselect All",
    "Copiado!" : "Copied!",
    "Erro!" : "Error!"
}

function httpGetRequest(url){
    const httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url, false);
    httpRequest.send();

    if (httpRequest.status < 200 || httpRequest.status >= 300)
        throw new Error(`HTTP ${httpRequest.status} fetching ${url}`);

    return httpRequest.responseText;
}

const translate = (shouldTranslate, text) => shouldTranslate? translations[text] : text;

const sortTexts = (first, second) => first.localeCompare(second);

const sortDates = (first, second) => convertDateToMonthAndYear(first) - convertDateToMonthAndYear(second);

const validateAndReturnDate = (date, otherwiseReturn) => date? convertDateToMonthAndYear(date) : otherwiseReturn;

function convertDateToMonthAndYear(date) {
    const splittedDate = date.split("/");

    const haveDay = splittedDate.length == 3;

    const month = splittedDate[haveDay? 1 : 0];
    const year = splittedDate[haveDay? 2 : 1];
    return month + "/" + year;
}

const convertToArray = (text) => text.split(",");

function convertToBoolean(text){
    switch(text.toString().toLowerCase().trim()){
        case "true":
        case "yes":
        case "1":
        case 1:
            return true;

        case "false":
        case "no":
        case "0":
        case 0:
        case null:
        case undefined:
            return false;

        default: 
            return Boolean(text);
    }
}

function convertQueryToJson(urlQuery){
    return urlQuery.substring(1)
                   .split("&")
                   .map(parameters => parameters.split("="))
                   .reduce((json, parameterCouple) => {
                       json[parameterCouple[0]] = parameterCouple[1];
                       return json;
                   }, {});
}
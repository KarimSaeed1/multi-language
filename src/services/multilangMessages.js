
const message = (ar,en,fr,lang) => {

let errorMessage = '';

switch (lang) {

case 'ar':
    errorMessage = ar;
    break;

case 'en-US':
    errorMessage = en
    break;

case 'fr':
    errorMessage = fr;
    break;

default:
    errorMessage = ar;

}

return errorMessage;

}

const response = (op,lang) => {

let errorMessage = '';

if(op == "POST") {
    switch (lang) {

        case 'ar':
            errorMessage = "تمت أضافة البيانات بنجاح";
            break;
        
        case 'en-US':
            errorMessage = "Add data done successfully"
            break;
        
        case 'fr':
            errorMessage = "Données ajoutées avec succès";
            break;
        
        default:
            errorMessage = "تمت أضافة البيانات بنجاح";
        
        }
} else if(op == "PATCH") {
    switch (lang) {

        case 'ar':
            errorMessage = "تم تعديل البيانات بنجاح";
            break;
        
        case 'en-US':
            errorMessage = "Update data done successfully"
            break;
        
        case 'fr':
            errorMessage = "Les données ont été modifiées avec succès";
            break;
        
        default:
            errorMessage = "تم تعديل البيانات بنجاح";
        
        }
} else if(op == "DELETE") {
    switch (lang) {

        case 'ar':
            errorMessage = "تم مسح البيانات بنجاح";
            break;
        
        case 'en-US':
            errorMessage = "Delete data done successfully"
            break;
        
        case 'fr':
            errorMessage = "Les données ont été effacées avec succès";
            break;
        
        default:
            errorMessage = "تم مسح البيانات بنجاح";
        
        }
} else if(op == "GET") {
    switch (lang) {

        case 'ar':
            errorMessage = "تم جلب البيانات بنجاح";
            break;
        
        case 'en-US':
            errorMessage = "Get data done successfully"
            break;
        
        case 'fr':
            errorMessage = "Données récupérées avec succès";
            break;
        
        default:
            errorMessage = "تم جلب البيانات بنجاح";
        
        }
}



return errorMessage;

}

const noDataMessages = (lang) => {

let errorMessage = '';

switch (lang) {

case 'ar':
    errorMessage = "لا يوجد بيانات";
    break;

case 'en-US':
    errorMessage = "There is no data"
    break;

case 'fr':
    errorMessage = "Il n'y a pas de données";
    break;

default:
    errorMessage = "لا يوجد بيانات";

}

return errorMessage;

}

const handleErrors = (errors, lang) => {

const errorMessages = [];
const errs = errors.errors


for (const key of Object.keys(errs)) {
let errorMessage ;

const allMessage = errs[key].message
const parts = allMessage.split('|') ;
const langIndex = {
'ar': 0,
'en-US': 1,
'fr': 2,
};

// Check if the language is supported, otherwise default to 'en-US'
const selectedLang = langIndex[lang] ? lang : 'ar';

errorMessage = parts[langIndex[selectedLang]]
errorMessage = errorMessage.replace('{{FIELD}}', key);
errorMessages.push(errorMessage)
}



return errorMessages;
}

module.exports = {message,response,noDataMessages,handleErrors}
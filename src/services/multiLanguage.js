// libraries
const mongoose = require('mongoose');

// constants
const allowedLanguages = ['ar','en-US'];

//validator to check if the selected language is valid
function validateLanguage (language) {
  return allowedLanguages.includes(language);
}

// Define the multilingual schema
const multilangSchema = [
  {
    lang: {
      type: String,
      validate: {
        validator: validateLanguage,
        message: 'Invalid language selected. Please choose from: ar , en-US *#* هذه اللغة غير مدعومة , من فضلك اختار لغة مدعومة بين العربى والانجليزى',
      },
      required: [true,"This field is required *#* هذه البيانات مطلوبة"],
    },
    value: {
      type: String,
      required: [true,"This field is required *#* هذه البيانات مطلوبة"],
    },
  },
];


// Define the multilingual schema for array of arrays fields
const schema = new mongoose.Schema({
  lang: {
    type: String,
    required: [true, "This field is required *#* هذه البيانات مطلوبة"],
    validate: {
      validator: validateLanguage,
      message: 'Invalid language selected. Please choose from: ar , en-US *#* هذه اللغة غير مدعومة , من فضلك اختار لغة مدعومة بين العربى والانجليزى',
    },
  },
  value: {
    type: String,
    required: [true, "This field is required *#* هذه البيانات مطلوبة"],
  },
});

// validator to check the length and the default language of the array of multilanguage properties
function validateArray (array) {
  if(!(array.find(e => e.lang == "ar"))) {
    throw new Error(`arabic language are required *#*اللغة العربيه للخانة مطلوبة`);
  }
  if (array.length > 2) {
    throw new Error(`Field can have at most 2 languages *#*يجب ان يكون للخانة لغتين فقط`);
  }
}

// validator to check the length and the default language of array of arrays of multilanguage properties
function validateArrayOfArrays (array) {
  array.forEach((arr) => {
    if(!(arr.find(e => e.lang == "ar"))) {
      throw new Error(`arabic language are required *#*اللغة العربيه للخانة مطلوبة`);
    }
    if (arr.length > 2) {
      throw new Error(`Field can have at most 2 languages *#*يجب ان يكون للخانة لغتين فقط`);
    }
  })

}

// check that the data is array of arrays data
function isArrayofArrays(data) {
if (!Array.isArray(data)) {
    return false;
}

for (const item of data) {
    if (!Array.isArray(item)) {
    return false;
    }
}

return true;
}

//retrieve product properties based on language
exports.getMultilangProperties = (object,propertiesToRetrieve, selectedLanguage) => {

const result = object.toObject();

propertiesToRetrieve.forEach((propertyName) => {

if(propertyName == "props") {
    let  allProps = [];
    
    object[propertyName].forEach((array) => {
    let title, props = [] ;
    // return title
    const titleProperty = array.title.find((prop) => prop.lang === selectedLanguage);
    if (titleProperty) {
        title = titleProperty.value;
    } else {
        const defaultTitleProperty = array.title.find((prop) => prop.lang === "ar");
        title = defaultTitleProperty ? defaultTitleProperty.value : null;
        
    }

    // return props
    array.props.forEach((subArray) => {
        const propsProperty = subArray.find((prop) => prop.lang === selectedLanguage);

        if (propsProperty) {
        props.push(propsProperty.value);
        } else {
        // Fallback to default language
        const defaultPropsProperty = subArray.find((prop) => prop.lang === "ar");
        props.push(defaultPropsProperty ? defaultPropsProperty.value : "");
        }
    });

    allProps.push({
        title : title,
        props : props
    })

    })

    // return all property
    result[propertyName] = allProps;

} else if (isArrayofArrays(object[propertyName])) {
    const resultArray = [];

    object[propertyName].forEach((subArray) => {
    const property = subArray.find((prop) => prop.lang === selectedLanguage);

    if (property) {
        resultArray.push(property.value);
    } else {
        // Fallback to default language
        const defaultProperty = subArray.find((prop) => prop.lang === "ar");
        if (defaultProperty) {
        resultArray.push(defaultProperty.value);
        } else {
        resultArray.push("");
        }
    }
    });

    result[propertyName] = resultArray;
} else {
    const property = object[propertyName].find((prop) => prop.lang === selectedLanguage);
    if (property) {
    result[propertyName] = property.value;
    } else {
    const defaultProperty = object[propertyName].find((prop) => prop.lang === "ar").value;
    if(defaultProperty) {
        result[propertyName] = defaultProperty
    } else {
        result[propertyName] = null;
    }
    
    }
}
});


return result;

}

module.exports = {validateLanguage , validateArray , validateArrayOfArrays  , multilangSchema , schema , isArrayofArrays , getMultilangProperties}
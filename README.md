# German Verb Conjugation API
This repository contains a REST API that distributes German verb conjugations from HTTP requests for the 8000 most common verbs in the language. It is built with Node.js and Express.js, with unit testing implemented through Jest and caching capabilities through Apicache.

## Table of Contents
* [Setup](#local-development-setup)
* [Usage](#usage)
    * [Array of Tenses](#subset-of-tenses)
    * [Specific Conjugation](#specific-conjugations)
    * [Supported Verb Tenses](#supported-verb-tenses)
    * [Special Character Handling](#special-character-handling)

## Local Development Setup
Simply clone this repository to your system and run `npm install` in order to install all dependencies. With a .env file containing your choice of PORT, you can then run `npm start` or `npm run start-with-nodemon` to open a local testing server. Unit tests can be run from `npm test`, to ensure no new errors have been introduced. Refer to the package.json file for all other available scripts.

## Usage
In order to use this API in your project, GET requests may be used with the desired verb as a query parameter, as well as additional optional specifications. Omitting the optional parameters will return the verb conjugated non-reflexively to all tenses, with a default auxiliary verb where applicable. An example is shown below:
> http<area>s://german-verbs-api.onrender.com/german-verbs-api?verb=gehen&tense=PERFEKT&aux=HABEN&verbCase=DATIVE

Will return the following JSON response:

>{"success":true,"data":{"S1":["habe mir","gegangen"],"S2":["hast dir","gegangen"],"S3":["hat sich","gegangen"],"P1":["haben uns","gegangen"],"P2":["habt euch","gegangen"],"P3":["haben sich","gegangen"]}}

All conjugations are returned as arrays, in order to allow the placement of words in between each element. 
An omitted or non-existant verb parameter will return a 400 or 404 error code, respectively, as well as a JSON response indicating the issue. An omitted tense parameter will return a data object containing conjugations to all tenses, minimizing HTTP requests should all tenses be desired.

### Subset of Tenses
Additionally, POST requests may be used to specify a collection of tenses if a subset of conjugations are desired, with the desired tenses passed as an array (see below for valid tenses). As previously, the aux and verbCase values can be omitted, with defaults chosen as necessary. An example is shown:
>http<area>s://german-verbs-api.onrender.com/german-verbs-api/tense-array

With the following request body:
>{
    "verb": "gehen",
    "tenseArray": ["PRASENS", "PERFEKT"],
    "aux": "SEIN",
    "verbCase": "ACCUSATIVE",
}

Will return the following response:
>{"success": true,"message": [],"data": {"PRASENS": {"S1": ["gehe mich"],"S2": ["gehst dich"],"S3": ["geht sich"],"P1": ["gehen uns"],"P2": ["geht euch"],"P3": ["gehen sich"]},"PERFEKT": {"S1": ["bin mich","gegangen"],"S2": ["bist dich","gegangen"],"S3": ["ist sich","gegangen"],"P1": ["sind uns","gegangen"],"P2": ["seid euch","gegangen"],"P3": ["sind sich","gegangen"]}}}

### Specific Conjugations
In a similar manner, conjugations of only a specific person at a specific tense can be requested, should a small response payload be desired.
>http<area>s://german-verbs-api.onrender.com/german-verbs-api

With the request body:
>{
    "verb": "gehen",
    "tense": "KONJUNKTIV1_PERFEKT",
    "person": 2,
    "number": "P"
}

Will return the response:
>{"success": true,"message": ["No auxiliary verb specified. Defaulting to a known one","No case specified. Defaulting to a non-reflexive verb"],"data": ["seiet","gegangen"]}

### Supported Verb Tenses
The following verb tenses are supported for all verbs:
* Indicative: `PRASENS`, `PRATERITUM`, `FUTUR1`, `FUTUR2`, `PERFEKT`, `PLUSQUAMPERFEKT`
* Subjunctive 1: `KONJUNKTIV1_PRASENS`, `KONJUNKTIV1_FUTUR1`, `KONJUNKTIV1_PERFEKT`
* Subjunctive 2: `KONJUNKTIV2_PRATERITUM`, `KONJUNKTIV2_FUTUR1`, `KONJUNKTIV2_FUTUR2`

### Special Character Handling
The 4 special characters in German, `ö`, `ü`, `ä`, and `ß`, can be optionally replaced in requests by `oe`, `ue`, `ae`, and `ss`, respectively. Thus, user input validation for these special characters is not necessary on the client side. Therefore, requests for conjugations for both `müssen` and `muessen` will be accepted by the API as valid inputs.

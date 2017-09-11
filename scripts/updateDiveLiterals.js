"use strict";

const csv = require('csvtojson');
const jsonfile = require('jsonfile');
const fetch = require('node-fetch');
const fs = require('fs');

const filesPath = './src/assets/'
let ES = {};
let EN = {};
let DE = {};
fetch(`https://docs.google.com/a/dive.tv/spreadsheets/d/196NhitNJI8tp0maHg0uLDG_1CwWIRC5zwP7yOnfDLPo/export?format=csv&id=196NhitNJI8tp0maHg0uLDG_1CwWIRC5zwP7yOnfDLPo&gid=43820590`)
    .then((response) => {
        const res = response.text();
        console.log("Recieved new texts from Google Sheets", res);
        if (res) {
            return res;
        } else {
            throw new Error("error parsing to text");
        }
    })
    .then((csvResponse) => {
    // var csvResponse = require('/Users/daniel.marino/Downloads/Literales\ Dive\ -\ Literales\ App\ 1st\ \(6\).csv');
    // fs.readFile('/Users/daniel.marino/Downloads/Literales\ Dive\ -\ Literales\ App\ 1st\ \(6\).csv','utf8', (err, csvResponse) => {
        // console.log("CSVRES", csvResponse);
        if (csvResponse) {
            console.log("Parse to csv");
            csv({
                trim: false,
                includeColumns: [1, 2, 3, 4],
                noheader: true,
                headers: ['', 'ID', 'ES', 'EN', 'DE']
            })
                .fromString(csvResponse)
                .on('csv', (csvRow, index) => {
                    if (index > 10) {
                        // console.log("ROW", index, csvRow);
                    }
                })
                .on('json', (jsonObj, index) => {
                    if (index > 10) { // IGNORE PREVIOUS ROWS
                        console.log("jsonObj", jsonObj);
                        ES[jsonObj.ID] = jsonObj.ES;
                        EN[jsonObj.ID] = jsonObj.EN;
                        DE[jsonObj.ID] = jsonObj.DE;
                    }
                    if (!ES && !EN && !DE) {
                        throw new Error("Error, all texts undefined, is the doc public?");
                    }
                })
                .on('done', (error) => {
                    if (!error) {
                        const files = [
                            `${filesPath}/ES/localized_texts.json`,
                            `${filesPath}/EN/localized_texts.json`,
                            `${filesPath}/DE/localized_texts.json`
                        ];
                        const obj = [ES, EN, DE];
                        files.map((file, i) => {
                            jsonfile.writeFile(file, obj[i], function (err) {
                                if (err) console.error(err);
                            });
                        })
                        console.log();
                        console.log("\x1b[32m", '😎 Finished converting CSV to JSON');
                        console.log("\x1b[36m", '👏 Files at ' + filesPath);
                        console.log("\x1b[0m", "");
                        console.log();
                    } else {
                        console.error(error);
                    }
                })
        } else {
            console.error("Error, empty csv");
        }
    })
    .catch((error) => {
        console.error("Error getting texts from Google Sheets, are you logged in google?", error);
    });

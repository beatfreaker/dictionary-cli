#! /usr/bin/env node
'use strict';
var got = require('got');
var chalk = require('chalk');
var meow = require('meow');
var url = 'https://www.googleapis.com/scribe/v1/research?key=AIzaSyDqVYORLCUXxSv7zneerIgC2UYMnxvPeqQ&dataset=dictionary&dictionaryLanguage=en&query=';
var responseData;
var dataArray;
var meaningArray;
var wordForms;
var synonyms = '';

var cli = meow({
	help: [
		'Usage',
		' > define <word>',
		'',
		'Examples',
		' > define taste'
	]
});

if (cli.input.length === 0) {
	console.error('A word is required');
	process.exit(1);
}

url += cli.input[0];

got.get(url, function (err, data, res) {
	if (err) {
		console.log(err.message);
		process.exit(1);
	}
	if (res.statusCode === 200) {
		responseData = JSON.parse(data);
		dataArray = responseData.data[0].dictionary.definitionData;
		for (var i = 0; i < dataArray.length; i++) {
			wordForms = '';
			console.log(chalk.green.bold(dataArray[i].pos));
			meaningArray = dataArray[i].meanings;
			for (var k = 0; k < dataArray[i].wordForms.length; k++) {
				wordForms += '  ' + chalk.white(dataArray[i].wordForms[k].word) + ' ' + chalk.green(dataArray[i].wordForms[k].form);
			}
			console.log('   ' + wordForms);
			for (var j = 0; j < meaningArray.length; j++) {
				console.log((j + 1) + '. ' + chalk.bgMagenta(meaningArray[j].meaning));
				if (meaningArray[j].examples && meaningArray[j].examples.length > 0) {
					console.log('   - ' + chalk.white.bold(meaningArray[j].examples[0]));
				}
				if (meaningArray[j].synonyms && meaningArray[j].synonyms.length > 0) {
					for (var syn = 0; syn < meaningArray[j].synonyms.length; syn++) {
						synonyms += ' ' + chalk.yellow(meaningArray[j].synonyms[syn].nym) + ',';
					}
					console.log('   synonyms - ' + synonyms.substring(0, synonyms.length - 1));
				}
			}
		}
	}
});

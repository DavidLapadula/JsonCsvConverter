const { csvToJson, jsonToCsv } = require('../src/app/utils/converters');

const invalidJson = `{"name": "John Doe","age": 30"city": "New York"}`; 
const validJson = `{"name": "Jane Doe","age": 25,"city": "Chicago"}`; 
const invalidCsv = `Name,Age,City`
const validSingleRowCSV = `Name,Age,City
John,30,New York`;
const validMultiRowCsv = `Name,Age,City
John,30,New York
Jane,25,Denver`;
const validOneRowCsvAsJson = "{\"Name\":\"John\",\"Age\":\"30\",\"City\":\"New York\"}";
const validMultiRowCsvAsJson = "[{\"Name\":\"John\",\"Age\":\"30\",\"City\":\"New York\"},{\"Name\":\"Jane\",\"Age\":\"25\",\"City\":\"Denver\"}]";

/*
    JSON to CSV tests
*/

test('JSON to CSV: null', () => {
    expect(jsonToCsv(null)).toBe(null);
});

test('JSON to CSV: Invalid string', () => {
    expect(jsonToCsv('123')).toBe(null);
});

test('JSON to CSV: Invalid object', () => {
    expect(jsonToCsv(invalidJson)).toBe(null);
});

test('JSON to CSV: Valid object', () => {
    // Jest finicky with multi line testing. Ensure string contains both expected rows
    expect(jsonToCsv(validJson)).toContain(`"name","age","city"`); 
    expect(jsonToCsv(validJson)).toContain(`"Jane Doe","25","Chicago"`);
});

/*
    CSV to JSON tests
*/
test('CSV to JSON: Invalid string', () => {
    expect(csvToJson(invalidCsv)).toBe(null);
});

test('CSV to JSON: null', () => {
    expect(csvToJson(null)).toBe(null);
});

test('CSV to JSON: Empty array', () => {
    expect(csvToJson([])).toBe(null);
});

test('CSV to JSON: Blank space', () => {
    expect(csvToJson(" ")).toBe(null);
});

test('CSV to JSON: Valid single row CSV', () => {
    expect(csvToJson(validMultiRowCsv)).toEqual(validMultiRowCsvAsJson);
});

test('CSV to JSON: Valid multi row CSV', () => {
    expect(csvToJson(validSingleRowCSV)).toEqual(validOneRowCsvAsJson);
});
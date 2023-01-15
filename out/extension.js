"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    console.log('Congratulations, your extension "json-to-from-camelcase-snake-case" is now active!');
    let disposableToSnakeCase = vscode.commands.registerCommand('json-to-from-camelcase-snake-case.to_snake_case', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const selection = getSelection(editor);
        const text = editor.document.getText(selection);
        const object = getJSON(text);
        convertKeys(object, 'snake');
        editor.edit((editBuilder) => {
            editBuilder.replace(selection, JSON.stringify(object, null, 2));
        });
        editor.selection = selection;
    });
    let disposableToCamelCase = vscode.commands.registerCommand('json-to-from-camelcase-snake-case.toCamelCase', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const selection = getSelection(editor);
        const text = editor.document.getText(selection);
        const object = getJSON(text);
        convertKeys(object, 'camel');
        editor.edit((editBuilder) => {
            editBuilder.replace(selection, JSON.stringify(object, null, 2));
        });
        editor.selection = selection;
    });
    context.subscriptions.push(disposableToSnakeCase);
    context.subscriptions.push(disposableToCamelCase);
}
exports.activate = activate;
function getSelection(editor) {
    const selection = editor.selection;
    const start = selection.start;
    const end = selection.end;
    return new vscode.Selection(start.line, 0, end.line + 1, 0);
}
function getJSON(text) {
    if (!text) {
        return;
    }
    var object;
    try {
        object = JSON.parse(text);
    }
    catch (e) {
        console.log("Invalid JSON!!");
    }
    return object;
}
const convertKeys = (obj, type) => {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        obj.forEach((element) => {
            if ((typeof element === 'object' && element !== null) || (Object.prototype.toString.call(element) === '[object Array]')) {
                convertKeys(element, type);
            }
        });
        return;
    }
    Object.keys(obj).forEach(key => {
        let newKey;
        if (type == 'snake') {
            newKey = toSnakeCase(key);
        }
        else {
            newKey = toCamelCase(key);
        }
        obj[newKey] = obj[key];
        if (newKey != key) {
            delete obj[key];
        }
        if ((typeof obj[newKey] === 'object' && obj[newKey] !== null) || (Object.prototype.toString.call(obj[newKey]) === '[object Array]')) {
            convertKeys(obj[newKey], type);
            return;
        }
    });
};
function toSnakeCase(key) {
    return key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}
function toCamelCase(key) {
    return key.split("_").reduce((res, word, i) => i === 0 ? word.toLowerCase() :
        `${res}${word.charAt(0).toUpperCase()}${word
            .substr(1)
            .toLowerCase()}`, "");
}
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
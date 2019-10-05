"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
/** To demonstrate code actions associated with Diagnostics problems, this file provides a mock diagnostics entries. */
const vscode = require("vscode");
/** Code that is used to associate diagnostic entries with code actions. */
exports.SYMBOL_MENTION = 'symbol_mention';
/** String to detect in the text document. */
const EMOJI = 'emoji';
/**
 * Analyzes the text document for problems.
 * This demo diagnostic problem provider finds all mentions of 'emoji'.
 * @param doc text document to analyze
 * @param emojiDiagnostics diagnostic collection
 */
function refreshDiagnostics(doc, emojiDiagnostics) {
    let diagnostics = [];
    for (let lineIndex = 0; lineIndex < doc.lineCount; lineIndex++) {
        const lineOfText = doc.lineAt(lineIndex);
        if (lineOfText.text.includes(EMOJI)) {
            diagnostics.push(createDiagnostic(doc, lineOfText, lineIndex));
        }
    }
    emojiDiagnostics.set(doc.uri, diagnostics);
}
exports.refreshDiagnostics = refreshDiagnostics;
function createDiagnostic(doc, lineOfText, lineIndex) {
    // find where in the line of thet the 'emoji' is mentioned
    let index = lineOfText.text.indexOf(EMOJI);
    // create range that represents, where in the document the word is
    let range = new vscode.Range(lineIndex, index, lineIndex, index + EMOJI.length);
    let diagnostic = new vscode.Diagnostic(range, "When you say 'emoji', do you want to find out more?", vscode.DiagnosticSeverity.Information);
    diagnostic.code = exports.SYMBOL_MENTION;
    return diagnostic;
}
function subscribeToDocumentChanges(context, emojiDiagnostics) {
    if (vscode.window.activeTextEditor) {
        refreshDiagnostics(vscode.window.activeTextEditor.document, emojiDiagnostics);
    }
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            refreshDiagnostics(editor.document, emojiDiagnostics);
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, emojiDiagnostics)));
    context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(doc => emojiDiagnostics.delete(doc.uri)));
}
exports.subscribeToDocumentChanges = subscribeToDocumentChanges;
//# sourceMappingURL=diagnostics.js.map
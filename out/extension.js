"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const diagnostics_1 = require("./diagnostics");
const latex_table_1 = require("./latex-table");
const COMMAND = 'code-actions-sample.command';
function activate(context) {
    context.subscriptions.push(vscode.languages.registerCodeActionsProvider('latex', new Emojizer(), {
        providedCodeActionKinds: Emojizer.providedCodeActionKinds
    }));
    const emojiDiagnostics = vscode.languages.createDiagnosticCollection("emoji");
    context.subscriptions.push(emojiDiagnostics);
    diagnostics_1.subscribeToDocumentChanges(context, emojiDiagnostics);
    context.subscriptions.push(vscode.languages.registerCodeActionsProvider('latex', new Emojinfo(), {
        providedCodeActionKinds: Emojinfo.providedCodeActionKinds
    }));
    context.subscriptions.push(vscode.commands.registerCommand(COMMAND, () => vscode.env.openExternal(vscode.Uri.parse('https://unicode.org/emoji/charts-12.0/full-emoji-list.html'))));
}
exports.activate = activate;
/**
 * Provides code actions for converting :) to an smiley emoji.
 */
class Emojizer {
    provideCodeActions(document, range) {
        const symbols = this.getSymbols(document, range);
        if (symbols.length === 0) {
            return;
        }
        const fixes = symbols.map(symbol => this.createFix(document, range, symbol));
        return fixes;
    }
    getSymbols(document, range) {
        const start = range.start;
        const line = document.lineAt(start.line);
        const char = line.text[start.character];
        const unicode = 'U+' + char.charCodeAt(0)
            .toString(16)
            .toUpperCase();
        const tex = latex_table_1.unicodeToTex[unicode];
        if (!tex) {
            return [];
        }
        return tex.split(', ');
    }
    createFix(document, range, tex) {
        const fix = new vscode.CodeAction(`Convert to ${tex}`, vscode.CodeActionKind.QuickFix);
        fix.edit = new vscode.WorkspaceEdit();
        fix.edit.replace(document.uri, new vscode.Range(range.start, range.start.translate(0, 1)), tex);
        return fix;
    }
}
Emojizer.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
exports.Emojizer = Emojizer;
/**
 * Provides code actions corresponding to diagnostic problems.
 */
class Emojinfo {
    provideCodeActions(document, range, context, token) {
        // for each diagnostic entry that has the matching `code`, create a code action command
        return context.diagnostics
            .filter(diagnostic => diagnostic.code === diagnostics_1.SYMBOL_MENTION)
            .map(diagnostic => this.createCommandCodeAction(diagnostic));
    }
    createCommandCodeAction(diagnostic) {
        const action = new vscode.CodeAction('Learn more...', vscode.CodeActionKind.QuickFix);
        action.command = { command: COMMAND, title: 'Learn more about emojis', tooltip: 'This will open the unicode emoji page.' };
        action.diagnostics = [diagnostic];
        action.isPreferred = true;
        return action;
    }
}
Emojinfo.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
exports.Emojinfo = Emojinfo;
//# sourceMappingURL=extension.js.map
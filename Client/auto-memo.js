// @ts-check

import { transformSync } from "esbuild";
import * as ts from "typescript";

/** @type {() => NonNullable<import("vite").UserConfig["plugins"]>[number]} */
export default function autoMemo() {
	return {
		name: "auto-memo",
		enforce: "pre",
		transform(/** @type {string} */ sourceText, /** @type {string} */ filename) {
			if (/\.(ts|tsx)$/.test(filename)) {
				try {
					const sourceFile = ts.createSourceFile(filename, sourceText, { languageVersion: ts.ScriptTarget.ESNext });
					const printer = ts.createPrinter();

					/** @type {Map<string, boolean>} */
					const fileMemoMap = new Map();
					const matches = sourceText.matchAll(/\/\/\s*(memo|no-memo)\s*(export\s*)?(function|const)\s*(\S*)/g);
					for (const match of matches) fileMemoMap.set(match[4], match[1] === "memo");

					let hasMemoImport = false;

					const updatedStatements = [...sourceFile.statements];

					/** @type {(node: ts.Node) => boolean} */
					function hasJSX(/** @type {ts.Node} */ node) {
						// Check if the node is a JSX element or contains JSX elements
						if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) return true;
						if (ts.isJsxFragment(node)) return true;
						const result = ts.forEachChild(node, hasJSX);
						return !!result;
					}

					function startWithUpperCase(/** @type {string} */ str) {
						return str.charAt(0) === str.charAt(0).toUpperCase();
					}

					function visit(/** @type {ts.Node} */ node) {
						if (
							!hasMemoImport &&
							ts.isImportDeclaration(node) &&
							ts.isStringLiteral(node.moduleSpecifier) &&
							node.importClause?.namedBindings &&
							ts.isNamedImports(node.importClause.namedBindings)
						) {
							if (node.moduleSpecifier.text !== "react") return;
							node.importClause?.namedBindings.elements.forEach((element) => {
								if (ts.isImportSpecifier(element) && ts.isIdentifier(element.name) && element.name.escapedText === "memo")
									hasMemoImport = true;
							});
						} else if (ts.isVariableStatement(node)) {
							const variableStatement = node;
							variableStatement.declarationList.declarations.forEach((declaration) => {
								if (!ts.isVariableDeclaration(declaration) || !ts.isIdentifier(declaration.name)) return;

								const originalName = declaration.name.text;
								const memoValue = fileMemoMap.get(originalName);
								const isNotToMemo = memoValue === false;
								const isToMemo = memoValue === true;

								if (
									isNotToMemo ||
									(!isToMemo && !(startWithUpperCase(originalName) && declaration.initializer && hasJSX(declaration.initializer)))
								)
									return;

								const newNameWithUnderscore = ts.factory.createIdentifier(`${originalName}_`);
								const newNameOriginal = ts.factory.createIdentifier(originalName);

								const memoCall = ts.factory.createCallExpression(ts.factory.createIdentifier("memo"), undefined, [
									newNameWithUnderscore,
								]);

								// Create the new variable declaration with the original name
								const newVariableDeclaration = ts.factory.createVariableDeclaration(
									newNameOriginal,
									undefined,
									undefined,
									memoCall
								);

								// Create a new VariableStatement for the new declaration
								const newVariableStatement = ts.factory.createVariableStatement(
									variableStatement.modifiers,
									ts.factory.createVariableDeclarationList([newVariableDeclaration], variableStatement.declarationList.flags)
								);

								// Rename the original variable
								const updatedDeclaration = ts.factory.updateVariableDeclaration(
									declaration,
									newNameWithUnderscore,
									declaration.exclamationToken,
									declaration.type,
									declaration.initializer
								);

								// Update the declaration list in the original VariableStatement
								const updatedDeclarationList = ts.factory.updateVariableDeclarationList(
									variableStatement.declarationList,
									variableStatement.declarationList.declarations.map((decl) => (decl === declaration ? updatedDeclaration : decl))
								);
								const updatedVariableStatement = ts.factory.updateVariableStatement(
									variableStatement,
									variableStatement.modifiers,
									updatedDeclarationList
								);

								// Find the index of the original VariableStatement and insert the new one after it
								const index = updatedStatements.indexOf(variableStatement);
								if (index !== -1) {
									// Replace the original with the updated one
									updatedStatements[index] = updatedVariableStatement;
									// Insert the new VariableStatement after the updated original
									updatedStatements.splice(index + 1, 0, newVariableStatement);
								}
							});
						} else if (ts.isFunctionDeclaration(node) && node.name && ts.isIdentifier(node.name)) {
							const originalName = node.name.text;
							const memoValue = fileMemoMap.get(originalName);
							const isNotToMemo = memoValue === false;
							const isToMemo = memoValue === true;

							if (isNotToMemo || (!isToMemo && !(startWithUpperCase(originalName) && hasJSX(node)))) return;

							const newNameWithUnderscore = ts.factory.createIdentifier(`${originalName}_`);
							const newNameOriginal = ts.factory.createIdentifier(originalName);

							const memoCall = ts.factory.createCallExpression(ts.factory.createIdentifier("memo"), undefined, [
								newNameWithUnderscore,
							]);

							// Create the new variable declaration with the original name
							const newVariableDeclaration = ts.factory.createVariableDeclaration(
								newNameOriginal,
								undefined,
								undefined,
								memoCall
							);

							// Create a new VariableStatement for the new declaration
							const newVariableStatement = ts.factory.createVariableStatement(
								node.modifiers,
								ts.factory.createVariableDeclarationList([newVariableDeclaration], ts.NodeFlags.Const)
							);

							// Create a new VariableDeclaration for the original function name
							const updatedFunctionDeclaration = ts.factory.updateFunctionDeclaration(
								node,
								node.modifiers,
								node.asteriskToken,
								newNameWithUnderscore,
								node.typeParameters,
								node.parameters,
								node.type,
								node.body
							);

							const index = updatedStatements.indexOf(node);
							if (index !== -1) {
								// Replace the original with the updated one
								updatedStatements[index] = updatedFunctionDeclaration;
								// Insert the new VariableStatement after the updated original
								updatedStatements.splice(index + 1, 0, newVariableStatement);
							}
						}
						ts.forEachChild(node, visit);
					}

					visit(sourceFile);

					if (!hasMemoImport) {
						const importClause = ts.factory.createImportClause(
							false,
							undefined,
							ts.factory.createNamedImports([
								ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier("memo")),
							])
						);
						const importMemo = ts.factory.createImportDeclaration(
							undefined,
							importClause,
							ts.factory.createStringLiteral("react")
						);
						updatedStatements.unshift(importMemo);
					}

					// Create a new SourceFile with the modified statements
					const updatedSourceFile = ts.factory.updateSourceFile(
						sourceFile,
						updatedStatements,
						sourceFile.isDeclarationFile,
						sourceFile.referencedFiles,
						sourceFile.typeReferenceDirectives,
						sourceFile.hasNoDefaultLib
					);
					sourceText = printer.printFile(updatedSourceFile);

					const result = transformSync(sourceText, {
						loader: filename.endsWith(".tsx") ? "tsx" : "ts",
						format: "esm",
						sourcemap: true,
						jsx: "preserve",
					});
					return {
						code: result.code,
						map: result.map,
					};
				} catch (error) {
					console.error(`Error transforming ${filename}:`, error);
					return { code: sourceText };
				}
			}
		},
	};
}

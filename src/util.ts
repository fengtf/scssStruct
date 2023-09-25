import * as vscode from 'vscode';
import getScssFile from './index';
import VARS from './vars';
import { readFileSync, writeFile } from 'fs';
import { resolve } from 'path';

/**
 * 当文件保存时执行扩展
 */
function excuteWhenSave(): vscode.Disposable {
  return vscode.workspace.onWillSaveTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    const activeDocument = editor.document;
    // 只处理处于未保存状态的文件
    if (!activeDocument.isDirty) return console.log('not dirty');
    const fileStr = generateProcess(activeDocument);
    updateScssFile(activeDocument.uri.fsPath, fileStr, () => {
      event.waitUntil(
        new Promise((resolve) => {
          editor.edit((editorBuilder) => {
            editorBuilder.replace(
              new vscode.Range(
                new vscode.Position(0, 0),
                new vscode.Position(activeDocument.lineCount + 1, 0)
              ),
              <string>fileStr
            );
            resolve([]);
          });
        })
      );
    });
  });
}
/**
 * 读取 .scss文件
 * @param currentDocumentFilePath 当前 vue文件的绝对路径，用于根据此来寻找 .scss文件
 */
function readScssFile(currentDocumentFilePath: string): string {
  let str = '';
  try {
    str = readFileSync(
      resolve(
        currentDocumentFilePath,
        VARS.config.scssStructureGenerateConf.scssFilePath
      )
    ).toString();
  } catch (e) {
    console.log('readScssFile Error:', (e as any).toString());
  }
  return str;
}
/**
 * 更新 scss，如果是单独的 .scss文件，则更新此文件，否则更新 style标签的内容
 * @param currentDocumentFilePath 当前 vue 文件的绝对路径，用于根据此来寻找 .scss文件
 * @param scssStr 更新后的 scss 字符串
 * @param noscssFilePathFn 当不指定 .scss文件路径（即使用了 style 标签）时，执行的方法
 */
function updateScssFile(
  currentDocumentFilePath: string,
  scssStr: string | void,
  noscssFilePathFn: Function
): void {
  if (!scssStr) return console.log('empty scssStr');
  if (!VARS.config.scssStructureGenerateConf.scssFilePath)
    return noscssFilePathFn();
  writeFile(
    resolve(
      currentDocumentFilePath,
      VARS.config.scssStructureGenerateConf.scssFilePath
    ),
    scssStr,
    (err) => {
      if (err) {
        return vscode.window.showInformationMessage(
          '写入scss错误：' + err.toString()
        );
      }
      console.log(
        '写入 scss文件成功',
        resolve(
          currentDocumentFilePath,
          VARS.config.scssStructureGenerateConf.scssFilePath
        )
      );
    }
  );
}
/**
 * 编译 scss
 * @param activeDocument 当前 vue 文件的绝对路径，用于根据此来寻找 .scss文件
 */
function generateProcess(activeDocument: vscode.TextDocument): string {
  // 如果不是 vue文件，则忽略
  if (activeDocument.languageId !== 'vue') {
    console.log('not vue', activeDocument.languageId);
    return '';
  }
  const activeText: string = activeDocument.getText();
  // 页面上不存在内容，或者不存在 template模板内容，则不处理
  if (!activeText || !/<template[\s\S]*<\/template>/.test(activeText)) {
    console.log('no activeText or no template', activeText.length);
    return '';
  }
  let fileStr = '';
  try {
    fileStr = getScssFile(
      activeText,
      VARS.config.scssStructureGenerateConf.scssFilePath
        ? readScssFile(activeDocument.uri.fsPath)
        : void 0
    );
  } catch (e) {
    console.log('getScssFile Error:', e);
  }
  return fileStr;
}
/**
 * 读取 scssStructureGenerate扩展的配置项
 */
function updateConfig(): void {
  const config = vscode.workspace.getConfiguration();
  console.log('config update:', VARS.config.scssStructureGenerateConf);
  VARS.config.scssStructureGenerateConf = config.scssStructureGenerate;
  if (typeof config.editor.tabSize === 'number') {
    VARS.config.indenConf.tabSize = config.editor.tabSize;
  }
}

/**
 *
 * @param text scss字符串
 * @returns 第一层级类名
 */
function getScssMainClassName(text: string) {
  const pattern = /\.([\w-]+)\s*\{/g;
  const classNames = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index === pattern.lastIndex) {
      pattern.lastIndex++;
    }
    classNames.push(match[1]);
  }
  return classNames;
}

export {
  excuteWhenSave,
  readScssFile,
  updateScssFile,
  generateProcess,
  updateConfig,
  getScssMainClassName,
};

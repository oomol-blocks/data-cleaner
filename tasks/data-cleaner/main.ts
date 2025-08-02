export type Inputs = {
    file: string;
    exportFormat: "excel" | "csv";
    outputDir: string;
    removeDuplicates: boolean;
    removeEmptyRows: boolean;
    removeEmptyColumns: boolean;
    trimWhitespace: boolean;
    checkValidate: boolean;
};

export type Outputs = {
    file: string;
    validationIssues: ValidationIssue[];
};

export type ValidationIssue = {
    row: number;        // 行号 (从1开始)
    column: string;     // 列名
    value: any;         // 原始值
    issue: string;      // 问题类型
    suggestion?: string; // 建议修复方式
};

import type { Context } from "@oomol/types/oocana";
import * as path from 'path';
import * as fs from 'fs/promises';
import { FileProcessor } from "./utils/processor";
import { DataCleaningEngine } from "./utils/cleaning";

export default async function (
    params: Inputs,
    context: Context<Inputs, Outputs>
): Promise<Partial<Outputs> | undefined | void> {

    try {
        console.log('开始数据清理处理...');
        console.log('输入参数:', params);

        // 1. 检查输入文件是否存在
        const inputPath = params.file;
        try {
            await fs.access(inputPath);
        } catch {
            throw new Error(`输入文件不存在: ${inputPath}`);
        }

        // 2. 读取文件数据
        console.log('读取文件数据...');
        const { data, headers } = await FileProcessor.readFile(inputPath);
        console.log(`读取成功: ${data.length} 行, ${headers.length} 列`);

        // 3. 执行数据清理
        console.log('执行数据清理...');
        const cleaner = new DataCleaningEngine(params);
        const { data: cleanedData, headers: cleanedHeaders, validationIssues } = await cleaner.cleanData(data, headers);

        // 4. 确保输出目录存在
        const outputDir = params.outputDir;
        try {
            await fs.mkdir(outputDir, { recursive: true });
        } catch (error) {
            console.warn(`创建输出目录失败，使用默认目录: ${error}`);
        }

        // 5. 生成输出文件路径
        const inputFileName = path.basename(inputPath, path.extname(inputPath));
        const outputExtension = params.exportFormat === 'excel' ? 'xlsx' : params.exportFormat;
        const outputPath = path.join(
            outputDir,
            `${inputFileName}_cleaned.${outputExtension}`
        );

        // 6. 写入清理后的数据
        console.log('写入清理后的数据...');
        await FileProcessor.writeFile(cleanedData, cleanedHeaders, params.exportFormat, outputPath);

        console.log(`数据清理完成，输出文件: ${outputPath}`);

        return {
            file: outputPath,
            validationIssues
        };

    } catch (error) {
        console.error('数据清理失败:', error);
        throw new Error(`数据清理失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
};

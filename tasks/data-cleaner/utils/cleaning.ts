import { Inputs, ValidationIssue } from "../main";
import { DataValidator } from "./validator";

export class DataCleaningEngine {
    private options: Partial<Inputs>;
    
    constructor(options: Partial<Inputs>) {
        this.options = options;
    }
    
    async cleanData(data: any[], headers: string[]): Promise<{ 
        data: any[], 
        headers: string[], 
        validationIssues: ValidationIssue[] 
    }> {
        let processedData = [...data];
        let processedHeaders = [...headers];
        let validationIssues: ValidationIssue[] = [];
        
        console.log(`开始数据清理，原始数据: ${processedData.length} 行, ${processedHeaders.length} 列`);

        // 1. 删除空行
        if (this.options.removeEmptyRows) {
            processedData = this.removeEmptyRows(processedData, processedHeaders);
        }
        
        // 2. 删除空列
        if (this.options.removeEmptyColumns) {
            const result = this.removeEmptyColumns(processedData, processedHeaders);
            processedData = result.data;
            processedHeaders = result.headers;
        }
        
        // 3. 去除首尾空格
        if (this.options.trimWhitespace) {
            processedData = this.trimWhitespace(processedData);
        }
        
        // 4. 去除重复行
        if (this.options.removeDuplicates) {
            processedData = this.removeDuplicates(processedData);
        }
        
        console.log(`数据清理完成，处理后数据: ${processedData.length} 行, ${processedHeaders.length} 列`);
                        
        // 5. 数据验证检查
        if (this.options.checkValidate) {
            console.log('执行数据合法性检查...');
            validationIssues = DataValidator.validateData(processedData, processedHeaders);
            console.log(`发现数据问题: ${validationIssues.length} 项`);
        }
        
        return { 
            data: processedData, 
            headers: processedHeaders, 
            validationIssues 
        };
    }
    
    private removeEmptyRows(data: any[], headers: string[]): any[] {
        const originalLength = data.length;
        
        const filtered = data.filter(row => {
            return headers.some(header => {
                const value = row[header];
                return value !== null && value !== undefined && String(value).trim() !== '';
            });
        });
        
        console.log(`删除空行: ${originalLength - filtered.length} 行`);
        return filtered;
    }
    
    private removeEmptyColumns(data: any[], headers: string[]): { data: any[], headers: string[] } {
        const columnsToKeep: string[] = [];
        
        headers.forEach(header => {
            const hasValue = data.some(row => {
                const value = row[header];
                return value !== null && value !== undefined && String(value).trim() !== '';
            });
            
            if (hasValue) {
                columnsToKeep.push(header);
            }
        });
        
        console.log(`删除空列: ${headers.length - columnsToKeep.length} 列`);
        
        const cleanedData = data.map(row => {
            const newRow: any = {};
            columnsToKeep.forEach(header => {
                newRow[header] = row[header];
            });
            return newRow;
        });
        
        return { data: cleanedData, headers: columnsToKeep };
    }
    
    private trimWhitespace(data: any[]): any[] {
        return data.map(row => {
            const newRow: any = {};
            Object.keys(row).forEach(key => {
                const value = row[key];
                newRow[key] = (typeof value === 'string') ? value.trim() : value;
            });
            return newRow;
        });
    }
    
    private removeDuplicates(data: any[]): any[] {
        const originalLength = data.length;
        const seen = new Set<string>();
        
        const unique = data.filter(row => {
            const key = JSON.stringify(row);
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
        
        console.log(`去除重复行: ${originalLength - unique.length} 行`);
        return unique;
    }
}
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs/promises';

// 文件处理器
export class FileProcessor {
    static async readFile(filePath: string): Promise<{ data: any[], headers: string[] }> {
        const ext = path.extname(filePath).toLowerCase();
        const fileContent = await fs.readFile(filePath);
        
        switch (ext) {
            case '.xlsx':
            case '.xls':
                return this.readExcel(fileContent);
                
            case '.csv':
                return this.readCSV(fileContent);
                
            case '.json':
                return this.readJSON(fileContent);
                
            default:
                throw new Error(`不支持的文件格式: ${ext}`);
        }
    }
    
    private static readExcel(buffer: Buffer): { data: any[], headers: string[] } {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        if (jsonData.length === 0) {
            throw new Error('Excel文件为空或无有效数据');
        }
        
        const headers = jsonData[0].map((header: any, index: number) => 
            header ? String(header) : `column_${index + 1}`
        );
        
        const data = jsonData.slice(1).map(row => {
            const rowObj: any = {};
            headers.forEach((header, index) => {
                rowObj[header] = row[index] !== undefined ? row[index] : '';
            });
            return rowObj;
        });
        
        return { data, headers };
    }
    
    private static readCSV(buffer: Buffer): { data: any[], headers: string[] } {
        // TODO：CSV解析 -> csv-parse
        const csvContent = buffer.toString('utf8');
        const lines = csvContent.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
            throw new Error('CSV文件为空');
        }
        
        const headers = this.parseCSVLine(lines[0]);
        const data = lines.slice(1).map(line => {
            const values = this.parseCSVLine(line);
            const rowObj: any = {};
            headers.forEach((header, index) => {
                rowObj[header] = values[index] !== undefined ? values[index] : '';
            });
            return rowObj;
        });
        
        return { data, headers };
    }
    
    private static parseCSVLine(line: string): string[] {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }
    
    private static readJSON(buffer: Buffer): { data: any[], headers: string[] } {
        const jsonContent = JSON.parse(buffer.toString('utf8'));
        
        if (!Array.isArray(jsonContent)) {
            throw new Error('JSON文件必须是对象数组格式');
        }
        
        if (jsonContent.length === 0) {
            throw new Error('JSON文件为空');
        }
        
        const headers = Object.keys(jsonContent[0]);
        return { data: jsonContent, headers };
    }
    
    static async writeFile(data: any[], headers: string[], format: string, outputPath: string): Promise<void> {
        switch (format.toLowerCase()) {
            case 'excel':
            case 'xlsx':
                await this.writeExcel(data, headers, outputPath);
                break;
                
            case 'csv':
                await this.writeCSV(data, headers, outputPath);
                break;
                
            case 'json':
                await this.writeJSON(data, outputPath);
                break;
                
            default:
                throw new Error(`不支持的输出格式: ${format}`);
        }
    }
    
    private static async writeExcel(data: any[], headers: string[], outputPath: string): Promise<void> {
        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Cleaned Data');
        
        // 设置列宽
        const colWidths = headers.map(header => ({
            wch: Math.max(header.length, 15)
        }));
        worksheet['!cols'] = colWidths;
        
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        await fs.writeFile(outputPath, buffer);
    }
    
    private static async writeCSV(data: any[], headers: string[], outputPath: string): Promise<void> {
        let csvContent = headers.map(h => `"${h}"`).join(',') + '\n';
        
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                return `"${String(value || '').replace(/"/g, '""')}"`;
            });
            csvContent += values.join(',') + '\n';
        });
        
        await fs.writeFile(outputPath, csvContent, 'utf8');
    }
    
    private static async writeJSON(data: any[], outputPath: string): Promise<void> {
        const jsonContent = JSON.stringify(data, null, 2);
        await fs.writeFile(outputPath, jsonContent, 'utf8');
    }
}
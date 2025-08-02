import { ValidationIssue } from "../main";

export class DataValidator {
    static validateData(data: any[], headers: string[]): ValidationIssue[] {
        const issues: ValidationIssue[] = [];

        data.forEach((row, rowIndex) => {
            headers.forEach(header => {
                const value = row[header];
                const rowNumber = rowIndex + 1;

                // 跳过空值检查
                if (!value || String(value).trim() === '') {
                    return;
                }

                // 根据列名关键词进行智能检查
                this.checkByColumnName(value, header, rowNumber, issues);
            });
        });

        return issues;
    }

    // 根据列名智能检查
    static checkByColumnName(value: any, column: string, row: number, issues: ValidationIssue[]) {
        const columnLower = column.toLowerCase();
        const valueStr = String(value).trim();

        // 数值类型检查
        if (this.isNumericColumn(column)) {
            this.validateNumeric(valueStr, column, row, issues);
        }

        // 日期类型检查
        else if (this.isDateColumn(column)) {
            this.validateDate(valueStr, column, row, issues);
        }

        // 联系信息检查
        else if (this.isEmailColumn(column)) {
            this.validateEmail(valueStr, column, row, issues);
        }
        else if (this.isPhoneColumn(column)) {
            this.validatePhone(valueStr, column, row, issues);
        }
        else if (this.isUrlColumn(column)) {
            this.validateUrl(valueStr, column, row, issues);
        }

        // 标识符检查
        else if (this.isIdColumn(column)) {
            this.validateId(valueStr, column, row, issues);
        }

        // 地址信息检查
        else if (this.isAddressColumn(column)) {
            this.validateAddress(valueStr, column, row, issues);
        }

        // 姓名检查
        else if (this.isNameColumn(column)) {
            this.validateName(valueStr, column, row, issues);
        }

        // 状态/枚举值检查
        else if (this.isStatusColumn(column)) {
            this.validateStatus(valueStr, column, row, issues);
        }

        // 通用文本质量检查
        else {
            this.validateTextQuality(value, column, row, issues);
        }
    }

    // ===== 列类型判断方法 (支持中英文) =====

    static isNumericColumn(column: string): boolean {
        const keywords = [
            // 中文关键词
            '年龄', '工资', '薪资', '金额', '价格', '数量', '总额', '费用', '成本', '收入', '支出', '余额', '佣金',
            // 英文关键词
            'age', 'salary', 'wage', 'amount', 'price', 'cost', 'fee', 'total', 'sum', 'quantity', 'count',
            'income', 'revenue', 'expense', 'balance', 'commission', 'rate', 'percent', 'score', 'rating'
        ];
        return keywords.some(keyword => column.toLowerCase().includes(keyword.toLowerCase()));
    }

    static isDateColumn(column: string): boolean {
        const keywords = [
            // 中文关键词
            '日期', '时间', '生日', '入职', '离职', '创建', '更新', '到期', '开始', '结束', '截止',
            // 英文关键词
            'date', 'time', 'datetime', 'timestamp', 'birthday', 'birth', 'created', 'updated', 'modified',
            'expired', 'expiry', 'start', 'end', 'begin', 'finish', 'deadline', 'due', 'last', 'first',
            'joined', 'hired', 'registered', 'signed'
        ];
        return keywords.some(keyword => column.toLowerCase().includes(keyword.toLowerCase()));
    }

    static isEmailColumn(column: string): boolean {
        const keywords = [
            // 中文关键词
            '邮箱', '邮件', '电邮', '电子邮件',
            // 英文关键词
            'email', 'mail', 'e-mail', 'contact'
        ];
        return keywords.some(keyword => column.toLowerCase().includes(keyword.toLowerCase()));
    }

    static isPhoneColumn(column: string): boolean {
        const keywords = [
            // 中文关键词
            '电话', '手机', '联系', '号码', '座机', '固话',
            // 英文关键词
            'phone', 'mobile', 'cell', 'telephone', 'tel', 'contact', 'number', 'call'
        ];
        return keywords.some(keyword => column.toLowerCase().includes(keyword.toLowerCase()));
    }

    static isUrlColumn(column: string): boolean {
        const keywords = [
            // 中文关键词
            '网站', '链接', '网址', '主页', '官网',
            // 英文关键词
            'url', 'website', 'link', 'site', 'web', 'homepage', 'domain', 'address'
        ];
        return keywords.some(keyword => column.toLowerCase().includes(keyword.toLowerCase()));
    }

    static isIdColumn(column: string): boolean {
        const keywords = [
            // 中文关键词
            'id', '编号', '代码', '号', '序号', '标识', '代号',
            // 英文关键词
            'id', 'identifier', 'code', 'number', 'no', 'num', 'key', 'ref', 'reference',
            'serial', 'sequence', 'index', 'uuid', 'guid'
        ];
        return keywords.some(keyword => column.toLowerCase().includes(keyword.toLowerCase()));
    }

    static isAddressColumn(column: string): boolean {
        const keywords = [
            // 中文关键词
            '地址', '住址', '邮编', '位置', '省', '市', '区', '县', '街道',
            // 英文关键词
            'address', 'location', 'zipcode', 'postcode', 'zip', 'postal', 'street', 'city',
            'state', 'province', 'country', 'region', 'area', 'district'
        ];
        return keywords.some(keyword => column.toLowerCase().includes(keyword.toLowerCase()));
    }

    static isNameColumn(column: string): boolean {
        const keywords = [
            // 中文关键词
            '姓名', '名字', '名称', '用户名', '昵称',
            // 英文关键词
            'name', 'firstname', 'lastname', 'fullname', 'username', 'nickname', 'title', 'label'
        ];
        return keywords.some(keyword => column.toLowerCase().includes(keyword.toLowerCase()));
    }

    static isStatusColumn(column: string): boolean {
        const keywords = [
            // 中文关键词
            '状态', '状况', '情况', '类型', '分类', '级别',
            // 英文关键词
            'status', 'state', 'condition', 'type', 'category', 'class', 'level', 'grade',
            'priority', 'stage', 'phase'
        ];
        return keywords.some(keyword => column.toLowerCase().includes(keyword.toLowerCase()));
    }

    // ===== 具体验证方法 =====

    static validateNumeric(value: string, column: string, row: number, issues: ValidationIssue[]) {
        // 检查中文数字
        if (/[一二三四五六七八九十百千万亿]/g.test(value)) {
            issues.push({
                row, column, value,
                issue: 'chinese_number',
                suggestion: '包含中文数字，建议转换为阿拉伯数字'
            });
            return;
        }

        // 检查货币符号和格式字符
        if (/[¥$€£￥]/g.test(value)) {
            issues.push({
                row, column, value,
                issue: 'currency_symbol',
                suggestion: '包含货币符号，建议移除保留纯数字'
            });
        }

        // 检查千位分隔符
        if (/,/.test(value)) {
            const cleanValue = value.replace(/,/g, '');
            if (!isNaN(Number(cleanValue))) {
                issues.push({
                    row, column, value,
                    issue: 'thousand_separator',
                    suggestion: '包含千位分隔符，建议使用纯数字格式'
                });
            }
        }

        // 检查年龄合理性
        if (column.includes('年龄') || column.toLowerCase().includes('age')) {
            const numValue = parseFloat(value.replace(/[^\d.]/g, ''));
            if (!isNaN(numValue) && (numValue < 0 || numValue > 150)) {
                issues.push({
                    row, column, value,
                    issue: 'unrealistic_age',
                    suggestion: `年龄值异常：${numValue}，请确认是否正确`
                });
            }
        }
    }

    static validateDate(value: string, column: string, row: number, issues: ValidationIssue[]) {
        // 检查中文日期格式
        if (value.includes('年') && value.includes('月')) {
            issues.push({
                row, column, value,
                issue: 'chinese_date_format',
                suggestion: '中文日期格式，建议使用标准格式 YYYY-MM-DD'
            });
            return;
        }

        // 检查日期有效性
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            issues.push({
                row, column, value,
                issue: 'invalid_date',
                suggestion: '无法识别的日期格式，建议使用 YYYY-MM-DD 格式'
            });
            return;
        }

        // 检查日期合理性
        const year = date.getFullYear();
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear + 10) {
            issues.push({
                row, column, value,
                issue: 'unrealistic_date',
                suggestion: `日期年份异常：${year}，请确认是否正确`
            });
        }
    }

    static validateEmail(value: string, column: string, row: number, issues: ValidationIssue[]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            issues.push({
                row, column, value,
                issue: 'invalid_email',
                suggestion: '邮箱格式不正确，标准格式：user@domain.com'
            });
        }
    }

    static validatePhone(value: string, column: string, row: number, issues: ValidationIssue[]) {
        // 移除常见分隔符
        const cleanPhone = value.replace(/[\s\-\+\(\)]/g, '');

        // 检查是否为纯数字
        if (!/^\d+$/.test(cleanPhone)) {
            issues.push({
                row, column, value,
                issue: 'invalid_phone_format',
                suggestion: '电话号码包含非数字字符'
            });
            return;
        }

        // 检查长度
        if (cleanPhone.length < 7 || cleanPhone.length > 15) {
            issues.push({
                row, column, value,
                issue: 'invalid_phone_length',
                suggestion: `电话号码长度异常：${cleanPhone.length}位，正常为7-15位`
            });
        }

        // 检查中国手机号格式 (11位且以1开头)
        if (cleanPhone.length === 11 && !cleanPhone.startsWith('1')) {
            issues.push({
                row, column, value,
                issue: 'invalid_mobile_format',
                suggestion: '11位号码不是有效的中国手机号格式'
            });
        }
    }

    static validateUrl(value: string, column: string, row: number, issues: ValidationIssue[]) {
        // 检查协议
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
            issues.push({
                row, column, value,
                issue: 'missing_protocol',
                suggestion: 'URL缺少协议前缀 (http:// 或 https://)'
            });
        }

        // 检查基本格式
        if (!value.includes('.') || value.includes(' ')) {
            issues.push({
                row, column, value,
                issue: 'invalid_url_format',
                suggestion: 'URL格式可疑，请检查是否正确'
            });
        }
    }

    static validateId(value: string, column: string, row: number, issues: ValidationIssue[]) {
        // 检查ID一致性 (是否与同列其他值格式一致)
        // 这里可以扩展更复杂的ID格式检查
        if (value.includes(' ')) {
            issues.push({
                row, column, value,
                issue: 'id_contains_space',
                suggestion: 'ID中包含空格，可能影响系统识别'
            });
        }
    }

    static validateAddress(value: string, column: string, row: number, issues: ValidationIssue[]) {
        // 检查地址完整性
        if (value.length < 5) {
            issues.push({
                row, column, value,
                issue: 'incomplete_address',
                suggestion: '地址信息过于简短，可能不完整'
            });
        }

        // 检查邮编格式 (中国邮编为6位数字)
        if (column.includes('邮编') || column.toLowerCase().includes('zip')) {
            if (!/^\d{6}$/.test(value)) {
                issues.push({
                    row, column, value,
                    issue: 'invalid_zipcode',
                    suggestion: '邮编格式不正确，中国邮编为6位数字'
                });
            }
        }
    }

    static validateName(value: string, column: string, row: number, issues: ValidationIssue[]) {
        // 检查姓名中是否包含数字
        if (/\d/.test(value)) {
            issues.push({
                row, column, value,
                issue: 'name_contains_numbers',
                suggestion: '姓名中包含数字，请确认是否正确'
            });
        }

        // 检查是否全部是特殊字符
        if (/^[^a-zA-Z\u4e00-\u9fa5\s\-\.]+$/.test(value)) {
            issues.push({
                row, column, value,
                issue: 'invalid_name_format',
                suggestion: '姓名格式异常，请检查是否正确'
            });
        }

        // 检查长度
        if (value.length > 50) {
            issues.push({
                row, column, value,
                issue: 'name_too_long',
                suggestion: '姓名过长，请确认是否正确'
            });
        }
    }

    static validateStatus(value: string, column: string, row: number, issues: ValidationIssue[]) {
        // 常见的状态值
        const commonStatuses = {
            // 通用状态 (中英文)
            active: ['active', 'inactive', '激活', '停用', '启用', '禁用'],
            enabled: ['enabled', 'disabled', '启用', '禁用'],
            status: ['pending', 'approved', 'rejected', 'processing', '待审', '通过', '拒绝', '处理中'],
            boolean: ['true', 'false', 'yes', 'no', '是', '否', '有', '无'],
            priority: ['high', 'medium', 'low', 'urgent', '高', '中', '低', '紧急'],
            gender: ['male', 'female', 'm', 'f', '男', '女'],
            yesno: ['y', 'n', 'yes', 'no', '是', '否']
        };

        // 检查是否为常见的可疑值
        const suspiciousValues = ['null', 'undefined', 'none', 'n/a', 'na', 'unknown', '未知', '空', '无'];
        if (suspiciousValues.includes(value.toLowerCase())) {
            issues.push({
                row, column, value,
                issue: 'suspicious_status_value',
                suggestion: '状态值可疑，建议统一格式或使用标准值'
            });
        }

        // 检查混合格式 (如同一列中有中文有英文)
        // 这个检查比较复杂，暂时简化
        if (value.length > 20) {
            issues.push({
                row, column, value,
                issue: 'status_too_long',
                suggestion: '状态值过长，可能不是标准状态格式'
            });
        }
    }

    static validateTextQuality(value: any, column: string, row: number, issues: ValidationIssue[]) {
        if (typeof value !== 'string') return;

        // 检查首尾空格 (应在trimWhitespace后很少出现)
        if (value !== value.trim()) {
            issues.push({
                row, column, value,
                issue: 'extra_whitespace',
                suggestion: '文本首尾包含多余空格'
            });
        }

        // 检查连续空格
        if (/\s{2,}/.test(value)) {
            issues.push({
                row, column, value,
                issue: 'multiple_spaces',
                suggestion: '文本包含连续空格'
            });
        }

        // 检查特殊控制字符
        if (/[\r\n\t]/.test(value)) {
            issues.push({
                row, column, value,
                issue: 'control_characters',
                suggestion: '文本包含换行符或制表符'
            });
        }

        // 检查全特殊字符
        if (/^[^a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value) && value.length > 1) {
            issues.push({
                row, column, value,
                issue: 'only_special_chars',
                suggestion: '内容仅包含特殊字符，请确认是否正确'
            });
        }
    }
}

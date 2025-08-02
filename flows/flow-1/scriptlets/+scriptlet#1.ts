//#region generated meta
type Inputs = {
    outputDir: string;
};
type Outputs = {
    excel: string;
    csv: string;
};
//#endregion

import * as fs from 'fs/promises';
import * as path from "path";
import * as XLSX from 'xlsx';

export default async function (params: Inputs): Promise<Partial<Outputs> | undefined | void> {
    try {
        const { outputDir } = params;
        console.log('🚀 开始生成全面验证测试文件...\n');

        // 确保输出目录存在
        await fs.mkdir(outputDir, { recursive: true });

        const generatedFiles = {} as Outputs;

        generatedFiles.excel = await generateExcelFile(outputDir);
        generatedFiles.csv = await generateCSVFile(outputDir);

        // 详细的测试数据说明
        console.log('\n📊 全面验证测试数据说明:');
        console.log('==========================================');

        console.log('\n📏 数据规模:');
        console.log(`总行数: ${comprehensiveTestData.length} 行`);
        console.log(`总列数: ${Object.keys(comprehensiveTestData[0]).length} 列`);

        console.log('\n🔍 测试的验证类型:');
        console.log('1. 📧 邮箱验证: 有效邮箱、无效格式、缺少@符号');
        console.log('2. 📞 电话验证: 中国手机号、国际号码、长度异常、包含字符');
        console.log('3. 📅 日期验证: 标准格式、中文格式、无效日期、异常年份');
        console.log('4. 🔢 数值验证: 中文数字、货币符号、千位分隔符、异常年龄');
        console.log('5. 🌐 URL验证: 标准URL、缺少协议、格式错误');
        console.log('6. 👤 姓名验证: 正常姓名、包含数字、特殊字符、过长');
        console.log('7. 🆔 ID验证: 标准ID、包含空格、格式不一致');
        console.log('8. 🏠 地址验证: 完整地址、过短地址、邮编格式');
        console.log('9. 📊 状态验证: 标准状态、可疑值、过长状态');
        console.log('10. 📝 文本质量: 多余空格、控制字符、特殊符号');

        console.log('\n🎯 基础清理测试:');
        console.log('- 重复行: 2组完全重复数据');
        console.log('- 空行: 1行完全空数据');
        console.log('- 空列: 2列完全空数据');
        console.log('- 空格问题: 首尾空格、连续空格、制表符换行符');

        console.log('\n🌍 中英文支持测试:');
        console.log('- 中文列名和英文列名并存');
        console.log('- 中文数据和英文数据格式');
        console.log('- 国际化日期和电话号码格式');

        console.log('\n📈 预期验证结果:');
        console.log('- checkValidate: 应发现约 25-30 个数据问题');
        console.log('- 涵盖所有验证类型的典型问题');
        console.log('- 提供具体的行列坐标和修复建议');

        console.log('\n✨ 文件生成完成，可以全面测试验证功能了！');

        return generatedFiles;
    } catch (e) {
        throw e;
    }
};

// 全面的测试数据 - 涵盖所有验证场景
const comprehensiveTestData = [
    // 1. 正常数据行 (作为对比基准)
    {
        "User_ID": "U001",
        "姓名": "张三",
        "Age": 25,
        "Email_Address": "zhangsan@example.com",
        "Phone_Number": "13812345678",
        "Salary": 8000.50,
        "Registration_Date": "2023-01-15",
        "Department": "技术部",
        "Website": "https://zhangsan.com",
        "Address": "北京市朝阳区建国路1号",
        "Zipcode": "100001",
        "Account_Status": "Active",
        "备注": "优秀员工",
        "空列1": "",
        "空列2": null
    },

    // 2. 完全重复数据行
    {
        "User_ID": "U001",
        "姓名": "张三",
        "Age": 25,
        "Email_Address": "zhangsan@example.com",
        "Phone_Number": "13812345678",
        "Salary": 8000.50,
        "Registration_Date": "2023-01-15",
        "Department": "技术部",
        "Website": "https://zhangsan.com",
        "Address": "北京市朝阳区建国路1号",
        "Zipcode": "100001",
        "Account_Status": "Active",
        "备注": "优秀员工",
        "空列1": "",
        "空列2": ""
    },

    // 3. 邮箱验证测试
    {
        "User_ID": "U002",
        "姓名": "李四",
        "Age": 30,
        "Email_Address": "invalid-email",  // 无效邮箱
        "Phone_Number": "13987654321",
        "Salary": 12000,
        "Registration_Date": "2022-03-20",
        "Department": "销售部",
        "Website": "https://lisi.com",
        "Address": "上海市浦东新区世纪大道100号",
        "Zipcode": "200120",
        "Account_Status": "Active",
        "备注": "销售经理",
        "空列1": "",
        "空列2": ""
    },

    // 4. 电话号码验证测试
    {
        "User_ID": "U003",
        "姓名": "王五",
        "Age": 28,
        "Email_Address": "wangwu@test.com",
        "Phone_Number": "1234567890123",  // 长度异常
        "Salary": 15000,
        "Registration_Date": "2021-12-01",
        "Department": "HR",
        "Website": "https://wangwu.net",
        "Address": "广州市天河区珠江新城",
        "Zipcode": "510623",
        "Account_Status": "Inactive",
        "备注": "人事专员",
        "空列1": "",
        "空列2": ""
    },

    // 5. 数值和货币验证测试
    {
        "User_ID": "U004",
        "姓名": "赵六",
        "Age": "三十五",  // 中文数字
        "Email_Address": "zhaoliu@company.com",
        "Phone_Number": "+86-138-0000-1111",  // 国际格式
        "Salary": "¥18,000.00",  // 包含货币符号和千位分隔符
        "Registration_Date": "2020-06-15",
        "Department": "产品部",
        "Website": "https://zhaoliu.design",
        "Address": "深圳市南山区科技园",
        "Zipcode": "518000",
        "Account_Status": "Active",
        "备注": "资深设计师",
        "空列1": " ",
        "空列2": "    "
    },

    // 6. 日期格式验证测试
    {
        "User_ID": "U005",
        "姓名": "孙七",
        "Age": 28,
        "Email_Address": "sunqi@company.org",
        "Phone_Number": "13900000000",
        "Salary": 22500.75,
        "Registration_Date": "2023年8月1日",  // 中文日期格式
        "Department": "财务部",
        "Website": "https://sunqi.io",
        "Address": "成都市高新区天府大道",
        "Zipcode": "610041",
        "Account_Status": "Active",
        "备注": "财务经理",
        "空列1": "",
        "空列2": ""
    },

    // 7. URL验证测试
    {
        "User_ID": "U006",
        "姓名": "周八",
        "Age": 32,
        "Email_Address": "zhouba@example.com",
        "Phone_Number": "13811111111",
        "Salary": 16000,
        "Registration_Date": "2023-05-10",
        "Department": "运营部",
        "Website": "not-a-valid-url",  // 无效URL
        "Address": "杭州市西湖区文一路",
        "Zipcode": "310012",
        "Account_Status": "Pending",
        "备注": "运营专员",
        "空列1": "",
        "空列2": ""
    },

    // 8. 姓名验证测试
    {
        "User_ID": "U007",
        "姓名": "Test123",  // 姓名包含数字
        "Age": 29,
        "Email_Address": "test@example.com",
        "Phone_Number": "13822222222",
        "Salary": 14000,
        "Registration_Date": "2023-02-15",
        "Department": "测试部",
        "Website": "https://test.com",
        "Address": "南京市玄武区中山路",
        "Zipcode": "210008",
        "Account_Status": "Active",
        "备注": "测试工程师",
        "空列1": "",
        "空列2": ""
    },

    // 9. 地址和邮编验证测试
    {
        "User_ID": "U008",
        "姓名": "陈九",
        "Age": 27,
        "Email_Address": "chenjiu@test.com",
        "Phone_Number": "13833333333",
        "Salary": 13000,
        "Registration_Date": "2023-03-01",
        "Department": "市场部",
        "Website": "https://chenjiu.co",
        "Address": "短",  // 地址过短
        "Zipcode": "12345",  // 邮编格式错误
        "Account_Status": "Active",
        "备注": "市场专员",
        "空列1": "",
        "空列2": ""
    },

    // 10. 异常值测试
    {
        "User_ID": "U009",
        "姓名": "异常测试",
        "Age": 999,  // 异常年龄
        "Email_Address": "outlier@test.com",
        "Phone_Number": "10000000000",  // 异常电话长度
        "Salary": 999999.99,
        "Registration_Date": "1800-01-01",  // 异常日期
        "Department": "测试部",
        "Website": "https://outlier.test",
        "Address": "测试地址异常值超长地址测试测试测试测试测试测试测试测试测试测试",
        "Zipcode": "999999",
        "Account_Status": "Unknown",
        "备注": "异常数据测试用例",
        "空列1": "",
        "空列2": ""
    },

    // 11. 文本质量问题测试
    {
        "User_ID": "  U010  ",  // ID包含空格
        "姓名": "  文本测试  ",  // 首尾空格
        "Age": 26,
        "Email_Address": "text@test.com",
        "Phone_Number": " 139-8765-4321 ",  // 电话包含格式字符和空格
        "Salary": " 11000 ",  // 数值包含空格
        "Registration_Date": " 2023/04/01 ",
        "Department": "  质量部  ",
        "Website": " http://text.test ",
        "Address": "   武汉市   江汉区   ",  // 多余空格
        "Zipcode": "430000",
        "Account_Status": "   Active   ",
        "备注": "需要\n\n测试\t\t文本质量",  // 包含换行符和制表符
        "空列1": "",
        "空列2": ""
    },

    // 12. 状态值验证测试
    {
        "User_ID": "U011",
        "姓名": "状态测试",
        "Age": 31,
        "Email_Address": "status@test.com",
        "Phone_Number": "13844444444",
        "Salary": 17000,
        "Registration_Date": "2023-06-01",
        "Department": "客服部",
        "Website": "https://status.test",
        "Address": "重庆市渝中区解放碑",
        "Zipcode": "400010",
        "Account_Status": "这是一个非常长的状态值不符合标准格式", // 状态值过长
        "备注": "客服主管",
        "空列1": "",
        "空列2": ""
    },

    // 13. 混合问题测试
    {
        "User_ID": " U 012 ",  // ID格式问题
        "姓名": "@#$%^&*",  // 姓名全特殊字符
        "Age": "age_error",  // 年龄非数字
        "Email_Address": "missing-at-symbol.com",  // 邮箱缺少@
        "Phone_Number": "phone-number",  // 电话包含字母
        "Salary": "工资保密",  // 非数字工资
        "Registration_Date": "无效日期",  // 无效日期
        "Department": "###",  // 部门全特殊字符
        "Website": "www.no-protocol.com",  // URL缺少协议
        "Address": "地",  // 地址过短
        "Zipcode": "invalid",  // 无效邮编
        "Account_Status": "null",  // 可疑状态值
        "备注": "混合问题测试用例",
        "空列1": "",
        "空列2": ""
    },

    // 14. 英文数据测试
    {
        "User_ID": "U013",
        "姓名": "John Smith",
        "Age": 35,
        "Email_Address": "john.smith@company.com",
        "Phone_Number": "+1-555-0123",  // 美国电话格式
        "Salary": "$50,000.00",  // 美元格式
        "Registration_Date": "2023-07-15T10:30:00Z",  // ISO时间格式
        "Department": "Engineering",
        "Website": "https://johnsmith.dev",
        "Address": "123 Main Street, New York, NY",
        "Zipcode": "10001",
        "Account_Status": "Active",
        "备注": "Senior Developer",
        "空列1": "",
        "空列2": ""
    },

    // 15. 完全空行 (应该被删除)
    {
        "User_ID": "",
        "姓名": "",
        "Age": "",
        "Email_Address": "",
        "Phone_Number": "",
        "Salary": "",
        "Registration_Date": "",
        "Department": "",
        "Website": "",
        "Address": "",
        "Zipcode": "",
        "Account_Status": "",
        "备注": "",
        "空列1": "",
        "空列2": ""
    },

    // 16. 部分空数据
    {
        "User_ID": "U014",
        "姓名": "",  // 空姓名
        "Age": null,
        "Email_Address": "partial@test.com",
        "Phone_Number": "",
        "Salary": undefined,
        "Registration_Date": "",
        "Department": "实习生",
        "Website": "",
        "Address": "",
        "Zipcode": "",
        "Account_Status": "Pending",
        "备注": "",
        "空列1": "",
        "空列2": ""
    },

    // 17. 边界值测试
    {
        "User_ID": "U015",
        "姓名": "边界测试用户姓名超长测试边界测试用户姓名超长测试边界测试用户姓名超长测试", // 姓名过长
        "Age": 150,  // 边界年龄
        "Email_Address": "boundary@test.co.uk",
        "Phone_Number": "1390000",  // 最短有效长度
        "Salary": 0.01,  // 最小工资
        "Registration_Date": "2100-12-31",  // 未来日期
        "Department": "边界测试部",
        "Website": "https://very-long-domain-name-for-testing-purposes.example.com/very/long/path",
        "Address": "这是一个非常长的地址用于测试地址长度边界情况测试",
        "Zipcode": "000000",
        "Account_Status": "边界状态测试",
        "备注": "边界值测试用例",
        "空列1": "",
        "空列2": ""
    }
];

// 生成Excel文件
async function generateExcelFile(outputDir: string) {
    try {
        // 创建工作簿
        const workbook = XLSX.utils.book_new();

        // 将JSON数据转换为工作表
        const worksheet = XLSX.utils.json_to_sheet(comprehensiveTestData);

        // 设置列宽
        const headers = Object.keys(comprehensiveTestData[0]);
        worksheet['!cols'] = headers.map(header => ({
            wch: Math.max(header.length + 2, 20)  // 增加列宽以适应更多数据
        }));

        // 添加工作表到工作簿
        XLSX.utils.book_append_sheet(workbook, worksheet, 'ComprehensiveTestData');

        // 生成文件路径
        const filePath = path.join(outputDir, 'comprehensive_test_data.xlsx');

        // 写入文件
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        await fs.writeFile(filePath, buffer);

        console.log('✅ Excel全面测试文件生成成功:', filePath);

        return filePath;
    } catch (error) {
        console.error('❌ Excel文件生成失败:', error);
        throw error;
    }
}

// 生成CSV文件
async function generateCSVFile(outputDir: string) {
    try {
        const headers = Object.keys(comprehensiveTestData[0]);
        let csvContent = headers.map(h => `"${h}"`).join(',') + '\n';

        comprehensiveTestData.forEach(row => {
            const values = headers.map(header => {
                let value = row[header];
                if (value === null || value === undefined) {
                    value = '';
                }
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csvContent += values.join(',') + '\n';
        });

        // 生成文件路径
        const filePath = path.join(outputDir, 'comprehensive_test_data.csv');

        await fs.writeFile(filePath, csvContent, 'utf8');

        console.log('✅ CSV全面测试文件生成成功:', filePath);

        return filePath;
    } catch (error) {
        console.error('❌ CSV文件生成失败:', error);
        throw error;
    }
}

# DataCleaner

一个基于 OOMOL 工作流的智能数据清理工具，支持多种数据格式的自动化清理和验证，让您的数据处理工作更加高效可靠。

## ✨ 特性

- 🧹 **智能清理** - 自动去除重复行、空行、空列和多余空格
- 📊 **多格式支持** - 支持 Excel (.xlsx/.xls) 和 CSV 格式的读取和导出
- 🔍 **数据验证** - 内置数据质量检查，识别并报告潜在问题
- 🎯 **精确控制** - 灵活的清理选项，满足不同场景需求

## 🚀 快速开始

1. [官网](https://oomol.com/zh-CN/downloads/)下载 OOMOL
2. `社区` 模块搜索 `data-cleaner`
3. `Use` 该插件
4. 在默认工作流中完成参数配置
5. 运行等待清理结果

## ⚙️ 配置参数

| 参数 | 类型 | 选项 | 默认值 | 说明 |
|------|------|------|--------|------|
| `file` | string | - | - | 输入数据文件路径 |
| `exportFormat` | string | excel, csv | excel | 输出文件格式 |
| `outputDir` | string | - | - | 输出目录路径 |
| `removeDuplicates` | boolean | true/false | true | 是否移除重复行 |
| `removeEmptyRows` | boolean | true/false | true | 是否移除空行 |
| `removeEmptyColumns` | boolean | true/false | true | 是否移除空列 |
| `trimWhitespace` | boolean | true/false | true | 是否清理多余空格 |
| `checkValidate` | boolean | true/false | true | 是否执行数据验证（将输出可能有问题的单元格） |

## 📊 支持的数据格式

### 输入格式
- **Excel 文件** (.xlsx, .xls) - 支持多工作表，自动读取第一个工作表
- **CSV 文件** (.csv) - 自动检测分隔符和编码格式

### 输出格式
- **Excel 格式** (.xlsx) - 保持原始格式，兼容性强
- **CSV 格式** (.csv) - 轻量级，便于其他工具处理

## 🔧 清理功能详解

### 重复数据处理
- 智能识别完全相同的数据行
- 保留第一次出现的记录
- 统计并报告重复数据数量

### 空值处理
- **空行移除**: 删除所有字段均为空的行
- **空列移除**: 删除所有数据均为空的列
- **空格清理**: 去除字段首尾多余空格

### 数据验证
- 检测数据类型不一致
- 识别异常值和格式错误
- 提供修复建议和问题定位

## 📋 输出结果

清理完成后，您将获得：

### 清理后的文件
- 文件名格式：`原文件名_cleaned.格式后缀`
- 保存到指定的输出目录
- 保持原始数据结构和格式

### 验证报告
每个发现的问题包含以下信息：

```typescript
{
    row: number;        // 问题所在行号 (从1开始)
    column: string;     // 问题所在列名
    value: any;         // 原始值
    issue: string;      // 问题类型描述
    suggestion?: string; // 修复建议 (可选)
}
```

## 🆘 支持

如果遇到问题或需要帮助：

* 📧 邮箱: honeysyt@gmail.com
* 🐛 问题反馈: [GitHub Issues](https://github.com/oomol-blocks/data-cleaner/issues)
* 📖 微信群支持: [微信群支持](https://oomol.com/img/qrcode@3x.png)

from oocana import Context

#region generated meta
import typing
class Inputs(typing.TypedDict):
    file: str
class Outputs(typing.TypedDict):
    file_path: str
    file_size_mb: typing.Any
    file_type: typing.Any
    file_extension: typing.Any
    engine_used: typing.Any
    total_sheets: list[typing.Any]
    sheet_names: list[typing.Any]
    current_sheet: typing.Any
    total_rows: list[typing.Any]
    total_columns: list[typing.Any]
    column_names: list[typing.Any]
    missing_values: list[typing.Any]
    preview_rows: list[typing.Any]
    data_types: list[typing.Any]
    has_duplicate_columns: bool
    has_empty_columns: typing.Any
    datetime_columns: list[typing.Any]
#endregion

import os
import pandas as pd
from pathlib import Path

def main(params: Inputs, context: Context) -> Outputs:
    """Excel文件预览 - 支持.xlsx和.xls格式专用处理"""
    print("开始处理Excel文件预览...")
    
    file_path = params.get('file')
    if not file_path:
        raise ValueError("未提供文件路径参数")
    
    print(f"Excel文件路径: {file_path}")
    
    # 检查文件是否存在
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Excel文件不存在: {file_path}")
    
    # 获取文件信息
    file_size = os.path.getsize(file_path)
    print(f"文件大小: {file_size / 1024 / 1024:.2f} MB")
    
    # 验证文件扩展名并选择引擎
    file_extension = Path(file_path).suffix.lower()
    if file_extension not in ['.xlsx', '.xls']:
        raise ValueError(f"不支持的Excel文件格式: {file_extension}，支持的格式: .xlsx, .xls")
    
    # 选择合适的引擎
    engine = 'openpyxl' if file_extension == '.xlsx' else 'xlrd'
    print(f"使用引擎: {engine}")
    
    try:
        print("开始分析Excel文件结构...")
        
        # 首先检查所有工作表
        excel_file = pd.ExcelFile(file_path, engine=engine)
        sheet_names = excel_file.sheet_names
        print(f"发现 {len(sheet_names)} 个工作表: {sheet_names}")
        
        # 确定要读取的工作表
        target_sheet = params.get('sheet_name')
        if target_sheet and target_sheet in sheet_names:
            sheet_name = target_sheet
            print(f"读取指定工作表: {sheet_name}")
        else:
            sheet_name = sheet_names[0]
            print(f"读取默认工作表: {sheet_name}")
            if target_sheet:
                print(f"警告: 指定的工作表 '{target_sheet}' 不存在，使用默认工作表")
        
        # 读取Excel文件
        df = pd.read_excel(
            file_path,
            sheet_name=sheet_name,
            nrows=5000,
            engine=engine,
            na_values=[
                '', '#N/A', '#VALUE!', '#REF!', '#NAME?', '#DIV/0!', '#NULL!', '#NUM!',
                'N/A', 'n/a', 'NA', 'na', 'NULL', 'null'
            ],  # Excel常见错误值和空值
            keep_default_na=True,
            header=0,  # 默认第一行为标题
            index_col=None  # 不使用任何列作为索引
        )
        
        print(f"Excel文件读取完成，数据形状: {df.shape}")
        
        # Excel特有的数据质量检查
        print("Excel数据质量检查:")
        print(f"- 工作表总数: {len(sheet_names)}")
        print(f"- 当前工作表: {sheet_name}")
        print(f"- 总行数: {len(df)}")
        print(f"- 总列数: {len(df.columns)}")
        print(f"- 缺失值总数: {df.isnull().sum().sum()}")
        
        # 检查是否有重复的列名
        duplicate_cols = df.columns[df.columns.duplicated()].tolist()
        if duplicate_cols:
            print(f"- 警告: 发现重复列名: {duplicate_cols}")
        
        # 检查是否有空列名
        empty_cols = [col for col in df.columns if pd.isna(col) or str(col).strip() == '']
        if empty_cols:
            print(f"- 警告: 发现空列名: {len(empty_cols)} 个")
        
        # 数据类型统计
        print(f"- 数据类型分布: {dict(df.dtypes.value_counts())}")
        
        # 检查日期列
        datetime_cols = df.select_dtypes(include=['datetime64']).columns.tolist()
        if datetime_cols:
            print(f"- 日期时间列: {datetime_cols}")
        
        # Excel特定提示
        if engine == 'openpyxl':
            print("- 注意: 公式已被计算结果替换")
            print("- 注意: 格式信息（颜色、字体等）未保留")
        
        # 限制预览行数
        preview_limit = 500
        if len(df) > preview_limit:
            preview_df = df.head(preview_limit)
            print(f"限制预览为前 {preview_limit} 行")
        else:
            preview_df = df
            
        print("开始预览Excel数据...")
        
        # 预览 DataFrame
        context.preview(preview_df)
        
        print("Excel预览完成！")
        print(f"列名: {list(df.columns)}")
        
        # 返回Excel文件特定信息
        return {
            "file_path": file_path,
            "file_size_mb": round(file_size / 1024 / 1024, 2),
            "file_type": "Excel",
            "file_extension": file_extension,
            "engine_used": engine,
            "total_sheets": len(sheet_names),
            "sheet_names": sheet_names,
            "current_sheet": sheet_name,
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "column_names": list(df.columns),
            "missing_values": int(df.isnull().sum().sum()),
            "preview_rows": len(preview_df),
            "data_types": {str(k): int(v) for k, v in df.dtypes.value_counts().items()},
            "has_duplicate_columns": len(duplicate_cols) > 0,
            "has_empty_columns": len(empty_cols) > 0,
            "datetime_columns": datetime_cols
        }
        
    except Exception as e:
        print(f"处理Excel文件过程中出错: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # 尝试提供更具体的错误信息
        if "No module named" in str(e):
            if engine == 'openpyxl':
                raise RuntimeError("缺少openpyxl库，请安装: pip install openpyxl")
            elif engine == 'xlrd':
                raise RuntimeError("缺少xlrd库，请安装: pip install xlrd")
        elif "not supported" in str(e).lower():
            raise RuntimeError(f"Excel文件格式不受支持或文件已损坏: {str(e)}")
        elif "permission" in str(e).lower():
            raise RuntimeError("文件被其他程序占用，请关闭Excel后重试")
        else:
            raise RuntimeError(f"处理Excel文件时出错: {str(e)}")
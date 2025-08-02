from oocana import Context

#region generated meta
import typing
class Inputs(typing.TypedDict):
    file: str
Outputs = typing.Dict[str, typing.Any]
#endregion

import os
import pandas as pd
from pathlib import Path

def main(params: Inputs, context: Context) -> Outputs:
    print("开始处理文件预览...")

    file_path = params.get('file')
    if not file_path:
        raise ValueError("未提供文件路径参数")

    print(f"文件路径: {file_path}")

    # 检查文件是否存在
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"输入文件不存在: {file_path}")

    # 获取文件信息
    file_size = os.path.getsize(file_path)
    print(f"文件大小: {file_size / 1024 / 1024:.2f} MB")

    # 获取文件扩展名
    file_extension = Path(file_path).suffix.lower()
    print(f"文件类型: {file_extension}")

    try:
        print("开始读取文件...")

        if file_extension == '.csv':
            # 读取 CSV 文件，限制行数避免内存问题
            df = pd.read_csv(file_path, nrows=1000)
        else:
            raise ValueError(f"不支持的文件格式: {file_extension}")

        print(f"文件读取完成，数据形状: {df.shape}")

        # 限制预览行数
        preview_limit = 100
        if len(df) > preview_limit:
            preview_df = df.head(preview_limit)
            print(f"限制预览为前 {preview_limit} 行")
        else:
            preview_df = df

        print("开始预览...")

        # 直接预览 DataFrame
        context.preview(preview_df)

        print("预览完成！")
        print(f"列名: {list(df.columns)}")

        return {}

    except Exception as e:
        print(f"处理过程中出错: {str(e)}")
        import traceback
        traceback.print_exc()
        raise RuntimeError(f"处理文件时出错: {str(e)}")
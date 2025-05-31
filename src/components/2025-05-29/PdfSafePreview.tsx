import React from 'react';

interface PdfSafePreviewProps {
  fileUrl: string;
  fileName?: string;
}

/**
 * PDF 安全预览组件
 * - 只允许下载或用 PDF.js 预览，不直接用 <iframe>/<embed>
 * - 用于演示 PDF XSS 风险与前端防护
 *
 * 用法：
 * <PdfSafePreview fileUrl="/uploads/test.pdf" />
 */
const PdfSafePreview: React.FC<PdfSafePreviewProps> = ({ fileUrl, fileName }) => {
  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <a href={fileUrl} download={fileName || true} target="_blank" rel="noopener noreferrer">
          下载 PDF 文件
        </a>
        <span style={{ marginLeft: 16, color: '#888' }}>
          （推荐下载后用本地 PDF 阅读器打开）
        </span>
      </div>
      <div style={{ marginTop: 8, color: '#888', fontSize: 14 }}>
        不建议直接用 <code>&lt;iframe&gt;</code> 或 <code>&lt;embed&gt;</code> 方式在前端预览用户上传的 PDF，防止 PDF 内嵌脚本被执行。
        <br />
        如需在线预览，建议用 PDF.js 并禁用脚本（可参考 PDF.js 官方文档配置）。
      </div>
    </div>
  );
};

export default PdfSafePreview; 
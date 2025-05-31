import React, { useState } from 'react';
// @ts-ignore
import DOMPurify from 'dompurify';

interface SvgSafePreviewProps {
  svgContent: string;
}

/**
 * SVG 安全预览组件
 * - 支持原始渲染和 DOMPurify 清洗后渲染
 * - 用于演示 SVG XSS 风险与前端防护
 *
 * 用法：
 * <SvgSafePreview svgContent={svgString} />
 */
const SvgSafePreview: React.FC<SvgSafePreviewProps> = ({ svgContent }) => {
  const [showSafe, setShowSafe] = useState(true);

  // 清洗 SVG
  const safeSvg = DOMPurify.sanitize(svgContent, { USE_PROFILES: { svg: true } });

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button onClick={() => setShowSafe(true)} disabled={showSafe}>
          安全渲染（推荐）
        </button>
        <button onClick={() => setShowSafe(false)} disabled={!showSafe} style={{ marginLeft: 8 }}>
          原始渲染（有风险）
        </button>
      </div>
      <div style={{ border: '1px solid #eee', padding: 16, minHeight: 120 }}>
        {showSafe ? (
          <div dangerouslySetInnerHTML={{ __html: safeSvg }} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: svgContent }} />
        )}
      </div>
      <div style={{ marginTop: 8, color: '#888', fontSize: 14 }}>
        {showSafe
          ? '已用 DOMPurify 清洗 SVG，移除脚本和危险属性。'
          : '原始 SVG，可能包含 XSS 风险（仅演示用）。'}
      </div>
    </div>
  );
};

export default SvgSafePreview; 
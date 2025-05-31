import React, { useState, useEffect } from 'react';
// @ts-ignore
import DOMPurify from 'dompurify';

const SvgIframeFullCompareDemo: React.FC = () => {
  const [type, setType] = useState<'safe' | 'xss'>('xss');
  const [mode, setMode] = useState<'direct' | 'safe'>('safe');

  const svgUrl = type === 'safe' ? '/img/safe.svg' : '/img/xss.svg';
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    fetch(svgUrl).then(res => res.text()).then(setSvgContent);
  }, [svgUrl]);

  const renderSvg = () => {
    if (!svgContent) return null;

    if (mode === 'safe') {
      const safeSvg = DOMPurify.sanitize(svgContent, { USE_PROFILES: { svg: true } });
      return <div dangerouslySetInnerHTML={{ __html: safeSvg }} />;
    }
    
    return <div dangerouslySetInnerHTML={{ __html: svgContent }} />;
  };

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button onClick={() => setType('safe')} disabled={type==='safe'}>安全 SVG</button>
        <button onClick={() => setType('xss')} disabled={type==='xss'} style={{marginLeft:8}}>恶意 SVG (含 XSS)</button>
        <span style={{marginLeft:16}}>渲染方式：</span>
        <button onClick={() => setMode('direct')} disabled={mode==='direct'}>直接渲染</button>
        <button onClick={() => setMode('safe')} disabled={mode==='safe'} style={{marginLeft:8}}>安全渲染</button>
      </div>
      <div style={{ marginBottom: 8 }}>
        {renderSvg()}
      </div>
      <div style={{marginTop:8, color:'#888', fontSize:14}}>
        你可以切换 SVG 文件和渲染方式：
        <ul>
          <li>直接渲染：直接使用 dangerouslySetInnerHTML 渲染 SVG</li>
          <li>安全渲染：使用 DOMPurify 清洗后再渲染</li>
        </ul>
      </div>
    </div>
  );
};

export default SvgIframeFullCompareDemo;
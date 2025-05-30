import React from 'react';

/**
 * 组件用于在 MDX 中渲染任意 HTML 字符串
 * @param {Object} props 组件属性
 * @param {string} props.html 要渲染的 HTML 字符串
 * @param {Object} props.style 可选的样式对象
 * @param {string} props.className 可选的 CSS 类名
 */
function HtmlRenderer({ html, style, className }) {
  return (
    <div 
      className={className} 
      style={style} 
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}

export default HtmlRenderer; 
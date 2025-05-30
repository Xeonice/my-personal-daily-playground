import * as React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home() {
  return (
    <Layout title="Claude 老师每日问答精选" description="记录 Claude 老师为组内同学每天提供的精彩问答">
      <main style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 150px)', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)'}}>
        <img src="/img/logo.svg" alt="Claude Logo" style={{width: 96, height: 96, marginBottom: 24, borderRadius: 24, boxShadow: '0 4px 24px #0001'}} />
        <h1 style={{fontSize: '2.6rem', fontWeight: 700, marginBottom: 12, color: '#222'}}>Claude 老师每日问答精选</h1>
        <p style={{fontSize: '1.2rem', color: '#555', marginBottom: 32, maxWidth: 480, textAlign: 'center'}}>本项目用于收集和整理 Claude 老师每天为组内同学提供的精彩问答与解答内容，便于大家查阅和学习。</p>
        <div style={{display: 'flex', gap: 20, marginBottom: 32}}>
          <Link className="button button--primary button--lg" to="/blog">查看问答归档</Link>
          <Link className="button button--secondary button--lg" to="/docs/intro">关于项目</Link>
        </div>
        <div style={{background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0001', padding: 24, maxWidth: 420, textAlign: 'center'}}>
          <h2 style={{fontSize: '1.3rem', fontWeight: 600, marginBottom: 8}}>关于 Claude 老师</h2>
          <p style={{fontSize: '1rem', color: '#666'}}>Claude 老师是一位乐于助人的 AI，每天为组内同学答疑解惑，内容涵盖技术、学习、生活等多个方面。</p>
        </div>
      </main>
    </Layout>
  );
} 
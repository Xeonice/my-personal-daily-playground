import * as React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { H1, H2, P } from '../components/ui/typography';

export default function Home() {
  return (
    <Layout title="Claude 老师每日问答精选" description="记录 Claude 老师为组内同学每天提供的精彩问答">
      <main
        className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] dark:from-background dark:to-background"
      >
        <img src="/img/logo.svg" alt="Claude Logo" style={{width: 96, height: 96, marginBottom: 24, borderRadius: 24, boxShadow: '0 4px 24px #0001'}} />
        <H1 className="mb-3 text-center">Claude 老师每日问答精选</H1>
        <P className="mb-8 max-w-xl text-center text-lg text-muted-foreground">本项目用于收集和整理 Claude 老师每天为组内同学提供的精彩问答与解答内容，便于大家查阅和学习。</P>
        <div style={{display: 'flex', gap: 20, marginBottom: 32}}>
          <Link to="/blog"><Button>查看问答归档</Button></Link>
          <Link to="/docs/intro"><Button variant="outline">关于项目</Button></Link>
        </div>
        <Card className="max-w-xl w-full text-center mt-2">
          <CardHeader>
            <CardTitle>关于 Claude 老师</CardTitle>
          </CardHeader>
          <CardContent>
            <P>Claude 老师是一位乐于助人的 AI，每天为组内同学答疑解惑，内容涵盖技术、学习、生活等多个方面。</P>
          </CardContent>
        </Card>
      </main>
    </Layout>
  );
} 
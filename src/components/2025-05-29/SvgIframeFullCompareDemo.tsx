import React, { useState, useEffect } from "react";
// @ts-ignore
import DOMPurify from "dompurify";
import { Label } from "@site/src/components/ui/label";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@site/src/components/ui/toggle-group";

const SvgIframeFullCompareDemo: React.FC = () => {
  const [type, setType] = useState<"safe" | "xss">("xss");
  const [mode, setMode] = useState<"direct" | "safe">("safe");

  const svgUrl = type === "safe" ? "/img/safe.svg" : "/img/xss.svg";
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    fetch(svgUrl)
      .then((res) => res.text())
      .then(setSvgContent);
  }, [svgUrl]);

  const renderSvg = () => {
    if (!svgContent) return null;

    if (mode === "safe") {
      const safeSvg = DOMPurify.sanitize(svgContent, {
        USE_PROFILES: { svg: true },
      });
      return <div dangerouslySetInnerHTML={{ __html: safeSvg }} />;
    }

    return <div dangerouslySetInnerHTML={{ __html: svgContent }} />;
  };

  return (
    <div>
      <div style={{ marginBottom: 8, display: "flex", alignItems: "center" }}>
        <Label>SVG 文件：</Label>
        <ToggleGroup
          variant="outline"
          size="lg"
          type="single"
          value={type}
          className="mr-4"
          onValueChange={(value) => value && setType(value as "safe" | "xss")}
        >
          <ToggleGroupItem value="safe">安全 SVG</ToggleGroupItem>
          <ToggleGroupItem value="xss">恶意 SVG</ToggleGroupItem>
        </ToggleGroup>
        <Label>渲染方式：</Label>
        <ToggleGroup
          type="single"
          variant="outline"
          size="lg"
          value={mode}
          onValueChange={(value) =>
            value && setMode(value as "direct" | "safe")
          }
        >
          <ToggleGroupItem value="direct">直接渲染</ToggleGroupItem>
          <ToggleGroupItem value="safe">安全渲染</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex justify-center mt-4">{renderSvg()}</div>
    </div>
  );
};

export default SvgIframeFullCompareDemo;

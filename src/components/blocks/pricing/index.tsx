"use client";

import { Check, ExternalLink, Info, TrendingUp, Zap } from "lucide-react";
import { Pricing as PricingType } from "@/types/blocks/pricing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PricingSection {
  id: string;
  title: string;
  description: string;
  type: string;
  data: any;
}

interface ExtendedPricingType extends PricingType {
  sections?: PricingSection[];
  official_links?: Array<{
    title: string;
    url: string;
    description: string;
  }>;
}

export default function Pricing({ pricing }: { pricing: ExtendedPricingType }) {
  if (pricing.disabled) {
    return null;
  }

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderPricingTable = (data: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Model</TableHead>
          <TableHead>Input Price</TableHead>
          <TableHead>Output Price</TableHead>
          <TableHead>Context Limit</TableHead>
          <TableHead>Features</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              {item.model}
              {item.model === "Gemini 2.0 Flash" && (
                <Badge variant="secondary" className="ml-2">Recommended</Badge>
              )}
            </TableCell>
            <TableCell className="font-mono text-green-600">{item.input_price}</TableCell>
            <TableCell className="font-mono text-green-600">{item.output_price}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{item.context_limit}</TableCell>
            <TableCell>
              <div className="space-y-1">
                {item.features.map((feature: string, fi: number) => (
                  <div key={fi} className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-green-500" />
                    {feature}
                  </div>
                ))}
                {item.note && (
                  <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                    <Info className="h-3 w-3 inline mr-1" />
                    {item.note}
                  </div>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderFreeTierInfo = (data: any) => (
    <div className="grid md:grid-cols-2 gap-4">
      {Object.entries(data).map(([key, value]: [string, any]) => (
        <Card key={key}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              {value.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {value.limits.map((limit: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-3 w-3 text-green-500" />
                  {limit}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderOptimizationTips = (data: any[]) => (
    <div className="grid md:grid-cols-2 gap-4">
      {data.map((item, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              {item.tip}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Save {item.savings}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderComparison = (data: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Provider</TableHead>
          <TableHead>Input Price</TableHead>
          <TableHead>Output Price</TableHead>
          <TableHead>Note</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              {item.provider}
              {item.provider === "Gemini 2.0 Flash" && (
                <Badge variant="default" className="ml-2">Best Value</Badge>
              )}
            </TableCell>
            <TableCell className="font-mono text-green-600">{item.input_price}</TableCell>
            <TableCell className="font-mono text-green-600">{item.output_price}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{item.note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="py-16">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 lg:text-5xl">
            {pricing.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {pricing.description}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-16">
          {pricing.sections?.map((section) => (
            <section key={section.id} id={section.id}>
              <div className="mb-8">
                <h2 className="text-3xl font-semibold mb-3">{section.title}</h2>
                <p className="text-muted-foreground">{section.description}</p>
              </div>
              
              <div className="bg-card rounded-lg border p-6">
                {section.type === "table" && renderPricingTable(section.data)}
                {section.type === "info" && renderFreeTierInfo(section.data)}
                {section.type === "list" && renderOptimizationTips(section.data)}
                {section.type === "comparison" && renderComparison(section.data)}
              </div>
            </section>
          ))}
        </div>

        {/* Official Links */}
        {pricing.official_links && (
          <section className="mt-16">
            <h2 className="text-3xl font-semibold mb-8 text-center">Official Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {pricing.official_links.map((link, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      onClick={() => handleExternalLink(link.url)}
                      className="w-full"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Official Site
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

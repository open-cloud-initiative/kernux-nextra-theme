// Copyright 2025 rafaeishikho.
// SPDX-License-Identifier: Apache-2.0

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsProps {
  tabs: { label: string; content: React.ReactNode }[];
}

export function CustomTabs({ tabs }: TabsProps) {
  return (
    <div>
      <Tabs
        defaultValue={tabs[0]?.label.toLocaleLowerCase().replace(/\s+/g, "-")}
      >
        <TabsList className="">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.label.toLocaleLowerCase().replace(/\s+/g, "-")}
              value={tab.label.toLocaleLowerCase().replace(/\s+/g, "-")}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.label.toLocaleLowerCase().replace(/\s+/g, "-")}
            value={tab.label.toLocaleLowerCase().replace(/\s+/g, "-")}
            className="mt-2"
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

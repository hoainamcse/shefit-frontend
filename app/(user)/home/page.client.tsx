"use client";

import { z } from "zod";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { PearIcon } from "@/components/icons/PearIcon";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { RectangleIcon } from "@/components/icons/RectangleIcon";
import { ClockIcon } from "@/components/icons/ClockIcon";
import { TriangleIcon } from "@/components/icons/TriangleIcon";
import { formSchema } from "@/app/(admin)/admin/(content-input)/homepage/schema";

type DataType = z.infer<typeof formSchema>;

// Todo: responsive
export function SectionFive({ data }: { data: DataType["section_5"] }) {
  const formCategories = [
    {
      label: "Quả lê",
      value: "pear",
      icon: PearIcon,
    },
    {
      label: "Quả táo",
      value: "apple",
      icon: AppleIcon,
    },
    {
      label: "Chữ nhật",
      value: "rectangle",
      icon: RectangleIcon,
    },
    {
      label: "Đồng hồ cát",
      value: "hourglass",
      icon: ClockIcon,
    },
    {
      label: "Tam giác ngược",
      value: "inverted_triangle",
      icon: TriangleIcon,
    },
  ];
  const [activeTab, setActiveTab] = useState(formCategories[0].value);

  // Todo: Need to get course data from API with course_ids

  return (
    <div className="py-8 lg:py-12">
      <div className="bg-[#FFF3F3]">
        <div className="container mx-auto py-8 lg:py-12 space-y-8 lg:space-y-10">
          <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center gap-4">
            <h2 className="text-2xl lg:text-3xl font-bold">{data.title}</h2>
            <p className="text-primary">{data.description}</p>
          </div>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-wrap justify-center gap-4">
              {formCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.value}
                    className={cn(
                      "flex items-center gap-2 font-medium rounded-md p-2 text-neutral-500 capitalize",
                      activeTab === category.value &&
                        "bg-background text-primary"
                    )}
                    onClick={() => setActiveTab(category.value)}
                  >
                    <Icon size={32} />
                    {category.label}
                  </button>
                );
              })}
            </div>
            <p className="text-center">
              {(data.form_category as any)[activeTab].description}
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {(data.form_category as any)[activeTab].course_ids.map(
                (courseId: string) => (
                  <div
                    key={courseId}
                    className="flex bg-neutral-200 p-4 rounded-md"
                  >
                    {courseId}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

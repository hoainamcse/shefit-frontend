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
import { useQuery } from "@/hooks/use-query";
import { getCourses } from "@/network/server/courses";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

type DataType = z.infer<typeof formSchema>;

// Todo: responsive
export function SectionFive({ data }: { data: DataType["section_5"] }) {
  const formCategories = [
    {
      id: 0,
      label: "Quả lê",
      value: "pear",
      icon: PearIcon,
    },
    {
      id: 1,
      label: "Quả táo",
      value: "apple",
      icon: AppleIcon,
    },
    {
      id: 2,
      label: "Chữ nhật",
      value: "rectangle",
      icon: RectangleIcon,
    },
    {
      id: 3,
      label: "Đồng hồ cát",
      value: "hourglass",
      icon: ClockIcon,
    },
    {
      id: 4,
      label: "Tam giác ngược",
      value: "inverted_triangle",
      icon: TriangleIcon,
    },
  ];
  const [activeTab, setActiveTab] = useState(formCategories[0]);

  const {
    data: _data,
    isLoading,
    error,
  } = useQuery(() =>
    Promise.all(
      Object.values(data.form_category).map((category: any) =>
        getCourses({
          ids: category.course_ids.join(","),
        })
      )
    )
  );

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading data</div>;
  }

  if (!_data) {
    return <div className="text-center">No data available</div>;
  }

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
                      activeTab.value === category.value &&
                        "bg-background text-primary"
                    )}
                    onClick={() => setActiveTab(category)}
                  >
                    <Icon size={32} />
                    {category.label}
                  </button>
                );
              })}
            </div>
            <p className="text-center">
              {(data.form_category as any)[activeTab.value].description}
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <Carousel>
              <CarouselContent>
                {_data[activeTab.id].data.map((course, mIndex) => (
                  <CarouselItem
                    key={course.id}
                    className="basis-4/5 lg:basis-1/4"
                  >
                    <Link href={`/courses/${course.id}/${course.course_format}-classes`}>
                      <CarouselItem
                        key={course.id}
                        className="basis-2/3 lg:basis-full"
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative w-full overflow-hidden">
                            <img
                              src={course.cover_image || "/temp/homepage-3.jpg"}
                              alt={course.course_name}
                              className="rounded-md w-full object-cover aspect-[5/7]"
                            />
                            <div
                              className={cn(
                                "absolute bottom-[15%] -left-[42px] -right-[42px] h-16 bg-gradient-to-t from-background to-transparent -rotate-12 text-background flex flex-col items-center justify-center",
                                mIndex === 1 && "bg-primary",
                                mIndex === 2 && "bg-ring",
                                mIndex === 3 && "bg-[#B60606]"
                              )}
                            >
                              <p className="uppercase text-sm lg:text-base font-semibold">
                                {course.course_name}
                              </p>
                              <p className="capitalize text-sm lg:text-base">
                                {course.difficulty_level}
                              </p>
                            </div>
                          </div>
                          <p className="text-center text-neutral-500">
                            {course.description}
                          </p>
                        </div>
                      </CarouselItem>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}

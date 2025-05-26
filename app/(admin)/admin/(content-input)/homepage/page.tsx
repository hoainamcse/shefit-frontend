"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

import { MainButton } from "@/components/buttons/main-button";
import {
  FormInputField,
  FormMultiSelectField,
  FormTextareaField,
} from "@/components/forms/fields";
import { useMutation } from "@/hooks/use-mutation";
import {
  getConfiguration,
  updateConfiguration,
} from "@/network/server/configurations";
import { toast } from "sonner";
import { formSchema } from "./schema";
import { useQuery } from "@/hooks/use-query";
import { Configuration } from "@/models/configuration";

const homepageID = 3;

export default function HomepagePage() {
  const { data, isLoading, error } = useQuery(() =>
    getConfiguration(homepageID)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading homepage configuration: {error.message}</div>;
  }

  if (!data || !data.data) {
    return <div>No configuration data found</div>;
  }

  return <HomepageForm defaultData={data.data.data} />;
}

function HomepageForm({ defaultData }: { defaultData: Configuration["data"] }) {
  const [activeTab, setActiveTab] = useState("section_1");

  // Initialize form with the default data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultData,
  });

  const { mutate, isLoading } = useMutation(
    (body: any) => updateConfiguration(homepageID, body),
    {
      onSuccess: () => {
        toast.success("Configuration updated successfully");
      },
      onError: (error) => {
        toast.error(`Failed to update configuration: ${error.message}`);
      },
    }
  );

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    mutate({ type: "homepage", data: values });
  }

  return (
    <ContentLayout
      title="Homepage Content"
      rightSection={
        <MainButton
          text="Lưu thay đổi"
          loading={isLoading}
          type="submit"
          form="hook-form"
        />
      }
    >
      <Form {...form}>
        <form
          id="hook-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 col-span-3"
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            orientation="vertical"
          >
            <TabsList className="mb-4 w-full [&>button]:flex-1">
              <TabsTrigger value="section_1">Hero</TabsTrigger>
              <TabsTrigger value="section_2">Section 2</TabsTrigger>
              <TabsTrigger value="section_3">Membership</TabsTrigger>
              <TabsTrigger value="section_4">CTA</TabsTrigger>
              <TabsTrigger value="section_5">Dáng</TabsTrigger>
              <TabsTrigger value="section_7">Thực đơn</TabsTrigger>
              <TabsTrigger value="section_8">Sản phẩm</TabsTrigger>
              <TabsTrigger value="section_9">HLV</TabsTrigger>
              <TabsTrigger value="section_10">FAQ</TabsTrigger>
              <TabsTrigger value="section_11">Contact</TabsTrigger>
            </TabsList>

            {/* Section 1 */}
            <TabsContent value="section_1">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: Hero</CardTitle>
                  <CardDescription>
                    Chỉnh sửa nội dung phần Hero
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInputField
                    form={form}
                    name="section_1.title"
                    label="Tiêu đề"
                  />
                  {form.watch("section_1.features")?.map((_, index) => (
                    <FormInputField
                      key={index}
                      form={form}
                      name={`section_1.features.${index}`}
                      label={`Feature ${index + 1}`}
                    />
                  ))}
                  <FormTextareaField
                    form={form}
                    name="section_1.description"
                    label="Mô tả"
                    rows={4}
                  />
                  <FormInputField
                    form={form}
                    name="section_1.image"
                    label="Image URL"
                  />
                  <FormInputField
                    form={form}
                    name="section_1.cta.text"
                    label="CTA Button Text"
                  />
                  <FormInputField
                    form={form}
                    name="section_1.cta.href"
                    label="CTA Button URL"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 2 */}
            <TabsContent value="section_2">
              <Card>
                <CardHeader>
                  <CardTitle>Tone Body Section</CardTitle>
                  <CardDescription>
                    Edit the Tone Body section content.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInputField
                    form={form}
                    name="section_2.title"
                    label="Tiêu đề"
                  />
                  <FormInputField
                    form={form}
                    name="section_2.subtitle"
                    label="Phụ đề"
                  />
                  <FormTextareaField
                    form={form}
                    name="section_2.description"
                    label="Mô tả"
                    rows={4}
                  />
                  {form.watch("section_2.features")?.map((_, index) => (
                    <Card key={index} className="p-4 space-y-4">
                      <FormInputField
                        form={form}
                        name={`section_2.features.${index}.title`}
                        label={`Feature ${index + 1} Tiêu đề`}
                      />
                      <FormTextareaField
                        form={form}
                        name={`section_2.features.${index}.description`}
                        label={`Feature ${index + 1} Mô tả`}
                        rows={4}
                      />
                    </Card>
                  ))}
                  <FormInputField
                    form={form}
                    name="section_2.image"
                    label="Image URL"
                  />
                  <FormInputField
                    form={form}
                    name="section_2.cta.text"
                    label="CTA Button Text"
                  />
                  <FormInputField
                    form={form}
                    name="section_2.cta.href"
                    label="CTA Button URL"
                    className="mb-4"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 3 */}
            <TabsContent value="section_3">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: Membership</CardTitle>
                  <CardDescription>
                    Chỉnh sửa nội dung phần Membership
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInputField
                    form={form}
                    name="section_3.title"
                    label="Tiêu đề"
                  />
                  <FormTextareaField
                    form={form}
                    name="section_3.description"
                    label="Mô tả"
                    rows={4}
                  />
                  <FormMultiSelectField
                    form={form}
                    data={[]}
                    name={`section_3.membership_ids`}
                    label={`Membership IDs`}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 4 */}
            <TabsContent value="section_4">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: CTA</CardTitle>
                  <CardDescription>Chỉnh sửa nội dung phần CTA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInputField
                    form={form}
                    name="section_4.title"
                    label="Tiêu đề"
                  />
                  <FormTextareaField
                    form={form}
                    name="section_4.description"
                    label="Mô tả"
                    rows={4}
                  />
                  <FormInputField
                    form={form}
                    name="section_4.cta.text"
                    label="CTA Button Text"
                  />
                  <FormInputField
                    form={form}
                    name="section_4.cta.href"
                    label="CTA Button URL"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 5 */}
            <TabsContent value="section_5">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: Dáng</CardTitle>
                  <CardDescription>
                    Chỉnh sửa nội dung phần Dáng
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInputField
                    form={form}
                    name="section_5.title"
                    label="Tiêu đề"
                  />
                  <FormTextareaField
                    form={form}
                    name="section_5.description"
                    label="Mô tả"
                    rows={4}
                  />

                  <Tabs defaultValue="pear">
                    <TabsList>
                      <TabsTrigger value="pear">Quả đào</TabsTrigger>
                      <TabsTrigger value="apple">Quả táo</TabsTrigger>
                      <TabsTrigger value="rectangle">Chữ nhật</TabsTrigger>
                      <TabsTrigger value="hourglass">Đồng hồ cát</TabsTrigger>
                      <TabsTrigger value="inverted_triangle">
                        Tam giác ngược
                      </TabsTrigger>
                    </TabsList>

                    {/* Quả đào body type */}
                    <TabsContent value="pear">
                      <Card>
                        <CardHeader>
                          <CardTitle>Dáng: Quả đào</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormTextareaField
                            form={form}
                            name="section_5.form_category.pear.description"
                            label="Mô tả"
                            rows={4}
                          />
                          <FormMultiSelectField
                            form={form}
                            data={[]}
                            name={`section_5.form_category.pear.course_ids`}
                            label={`Khoá tập IDs`}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Quả táo body type */}
                    <TabsContent value="apple">
                      <Card>
                        <CardHeader>
                          <CardTitle>Dáng: Quả táo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormTextareaField
                            form={form}
                            name="section_5.form_category.apple.description"
                            label="Mô tả"
                            rows={4}
                          />
                          <FormMultiSelectField
                            form={form}
                            data={[]}
                            name={`section_5.form_category.apple.course_ids`}
                            label={`Khoá tập IDs`}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Chữ nhật body type */}
                    <TabsContent value="rectangle">
                      <Card>
                        <CardHeader>
                          <CardTitle>Dáng: Chữ nhật</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormTextareaField
                            form={form}
                            name="section_5.form_category.rectangle.description"
                            label="Mô tả"
                            rows={4}
                          />
                          <FormMultiSelectField
                            form={form}
                            data={[]}
                            name={`section_5.form_category.rectangle.course_ids`}
                            label={`Khoá tập IDs`}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Đồng hồ cát body type */}
                    <TabsContent value="hourglass">
                      <Card>
                        <CardHeader>
                          <CardTitle>Dáng: Đồng hồ cát</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormTextareaField
                            form={form}
                            name="section_5.form_category.hourglass.description"
                            label="Mô tả"
                            rows={4}
                          />
                          <FormMultiSelectField
                            form={form}
                            data={[]}
                            name={`section_5.form_category.hourglass.course_ids`}
                            label={`Khoá tập IDs`}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Tam giác ngược body type */}
                    <TabsContent value="inverted_triangle">
                      <Card>
                        <CardHeader>
                          <CardTitle>Dáng: Tam giác ngược</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormTextareaField
                            form={form}
                            name="section_5.form_category.inverted_triangle.description"
                            label="Mô tả"
                            rows={4}
                          />
                          <FormMultiSelectField
                            form={form}
                            data={[]}
                            name={`section_5.form_category.inverted_triangle.course_ids`}
                            label={`Khoá tập IDs`}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 7 */}
            <TabsContent value="section_7">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: Thực đơn</CardTitle>
                  <CardDescription>
                    Chỉnh sửa nội dung phần Thực đơn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInputField
                    form={form}
                    name="section_7.title"
                    label="Tiêu đề"
                  />
                  <FormInputField
                    form={form}
                    name="section_7.subtitle"
                    label="Phụ đề"
                  />
                  <FormMultiSelectField
                    form={form}
                    data={[]}
                    name={`section_7.meal_plan_ids`}
                    label={`Thực đơn IDs`}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 8 */}
            <TabsContent value="section_8">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: Sản phẩm</CardTitle>
                  <CardDescription>
                    Chỉnh sửa nội dung phần Sản phẩm
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInputField
                    form={form}
                    name="section_8.title"
                    label="Tiêu đề"
                  />
                  <FormTextareaField
                    form={form}
                    name="section_8.description"
                    label="Mô tả"
                    rows={4}
                  />
                  <FormMultiSelectField
                    form={form}
                    data={[]}
                    name={`section_8.product_ids`}
                    label={`Sản phẩm IDs`}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 9 */}
            <TabsContent value="section_9">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: HLV</CardTitle>
                  <CardDescription>Chỉnh sửa nội dung phần HLV</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormMultiSelectField
                    form={form}
                    data={[]}
                    name={`section_9.coach_ids`}
                    label={`HLV IDs`}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 10 */}
            <TabsContent value="section_10">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: FAQ</CardTitle>
                  <CardDescription>Chỉnh sửa nội dung phần FAQ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Card className="p-4">
                    <CardTitle className="mb-4">Top FAQ</CardTitle>
                    <FormInputField
                      form={form}
                      name="section_10.top.title"
                      label="Tiêu đề"
                    />
                    <FormTextareaField
                      form={form}
                      name="section_10.top.description"
                      label="Mô tả"
                      rows={4}
                    />
                    <FormInputField
                      form={form}
                      name="section_10.top.image"
                      label="Image URL"
                    />
                  </Card>
                  <Card className="p-4 space-y-4">
                    <CardTitle className="mb-4">Bottom FAQ</CardTitle>
                    <FormInputField
                      form={form}
                      name="section_10.bottom.title"
                      label="Tiêu đề"
                    />
                    <FormTextareaField
                      form={form}
                      name="section_10.bottom.description"
                      label="Mô tả"
                      rows={4}
                    />
                    <FormInputField
                      form={form}
                      name="section_10.bottom.image"
                      label="Image URL"
                    />
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 11 */}
            <TabsContent value="section_11">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: Contact</CardTitle>
                  <CardDescription>
                    Chỉnh sửa nội dung phần Contact
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInputField
                    form={form}
                    name="section_11.image"
                    label="Image URL"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* <Button type="submit">Save Changes</Button> */}
        </form>
      </Form>
    </ContentLayout>
  );
}

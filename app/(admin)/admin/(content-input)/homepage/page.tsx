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
  SectionOne,
  SectionTwo,
  SectionThree,
  SectionFour,
  SectionFive,
  SectionSeven,
  SectionEight,
  SectionNine,
  SectionTen,
  SectionEleven,
} from "@/app/(user)/home/section";
import { FormInputField, FormTextareaField } from "@/components/forms/fields";
import { useMutation } from "@/hooks/use-mutation";
import {
  getConfiguration,
  updateConfiguration,
} from "@/network/server/configuarations";
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

function HomepageForm({ defaultData }: { defaultData: Configuration['data'] }) {
  console.log("Default Data:", defaultData);
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
      <Tabs defaultValue="edit">
        <TabsList className="mb-4 w-full [&>button]:flex-1">
          <TabsTrigger value="edit">Edit ({activeTab})</TabsTrigger>
          <TabsTrigger value="preview">Preview ({activeTab})</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <div className="relative">
            {activeTab === "section_1" && (
              <SectionOne data={form.getValues().section_1} />
            )}
            {activeTab === "section_2" && (
              <SectionTwo data={form.getValues().section_2} />
            )}
            {activeTab === "section_3" && (
              <SectionThree data={form.getValues().section_3} />
            )}
            {activeTab === "section_4" && (
              <SectionFour data={form.getValues().section_4} />
            )}
            {activeTab === "section_5" && (
              <SectionFive data={form.getValues().section_5} />
            )}
            {activeTab === "section_7" && (
              <SectionSeven data={form.getValues().section_7} />
            )}
            {activeTab === "section_8" && (
              <SectionEight data={form.getValues().section_8} />
            )}
            {activeTab === "section_9" && (
              <SectionNine data={form.getValues().section_9} />
            )}
            {activeTab === "section_10" && (
              <SectionTen data={form.getValues().section_10} />
            )}
            {activeTab === "section_11" && (
              <SectionEleven data={form.getValues().section_11} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="edit">
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
                  <TabsTrigger value="section_1">Section 1</TabsTrigger>
                  <TabsTrigger value="section_2">Section 2</TabsTrigger>
                  <TabsTrigger value="section_3">Section 3</TabsTrigger>
                  <TabsTrigger value="section_4">Section 4</TabsTrigger>
                  <TabsTrigger value="section_5">Section 5</TabsTrigger>
                  <TabsTrigger value="section_7">Section 7</TabsTrigger>
                  <TabsTrigger value="section_8">Section 8</TabsTrigger>
                  <TabsTrigger value="section_9">Section 9</TabsTrigger>
                  <TabsTrigger value="section_10">Section 10</TabsTrigger>
                  <TabsTrigger value="section_11">Section 11</TabsTrigger>
                </TabsList>

                {/* Section 1 */}
                <TabsContent value="section_1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hero Section</CardTitle>
                      <CardDescription>
                        Edit the main hero section content.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormInputField
                        form={form}
                        name="section_1.title"
                        label="Title"
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
                        label="Description"
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
                        label="Title"
                      />
                      <FormInputField
                        form={form}
                        name="section_2.subtitle"
                        label="Subtitle"
                      />
                      <FormTextareaField
                        form={form}
                        name="section_2.description"
                        label="Description"
                        rows={4}
                      />
                      {form.watch("section_2.features")?.map((_, index) => (
                        <Card key={index} className="p-4 space-y-4">
                          <FormInputField
                            form={form}
                            name={`section_2.features.${index}.title`}
                            label={`Feature ${index + 1} Title`}
                          />
                          <FormTextareaField
                            form={form}
                            name={`section_2.features.${index}.description`}
                            label={`Feature ${index + 1} Description`}
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
                      <CardTitle>Programs Section</CardTitle>
                      <CardDescription>
                        Edit the programs section content.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormInputField
                        form={form}
                        name="section_3.title"
                        label="Title"
                      />
                      <FormTextareaField
                        form={form}
                        name="section_3.description"
                        label="Description"
                        rows={4}
                      />
                      {form
                        .watch("section_3.membership_ids")
                        ?.map((_, index) => (
                          <FormInputField
                            key={index}
                            form={form}
                            name={`section_3.membership_ids.${index}`}
                            label={`Membership ID ${index + 1}`}
                          />
                        ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Section 4 */}
                <TabsContent value="section_4">
                  <Card>
                    <CardHeader>
                      <CardTitle>CTA Section</CardTitle>
                      <CardDescription>
                        Edit the call-to-action section content.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormInputField
                        form={form}
                        name="section_4.title"
                        label="Title"
                      />
                      <FormTextareaField
                        form={form}
                        name="section_4.description"
                        label="Description"
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
                      <CardTitle>Body Types Section</CardTitle>
                      <CardDescription>
                        Edit the body types section content.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormInputField
                        form={form}
                        name="section_5.title"
                        label="Title"
                      />
                      <FormTextareaField
                        form={form}
                        name="section_5.description"
                        label="Description"
                        rows={4}
                      />

                      <Tabs defaultValue="pear">
                        <TabsList>
                          <TabsTrigger value="pear">Quả đào</TabsTrigger>
                          <TabsTrigger value="apple">Quả táo</TabsTrigger>
                          <TabsTrigger value="rectangle">Chữ nhật</TabsTrigger>
                          <TabsTrigger value="hourglass">
                            Đồng hồ cát
                          </TabsTrigger>
                          <TabsTrigger value="inverted_triangle">
                            Tam giác ngược
                          </TabsTrigger>
                        </TabsList>

                        {/* Quả đào body type */}
                        <TabsContent value="pear">
                          <Card>
                            <CardHeader>
                              <CardTitle>Quả đào Body Type</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <FormTextareaField
                                form={form}
                                name="section_5.form_category.pear.description"
                                label="Description"
                                rows={4}
                              />
                              {form
                                .watch(
                                  "section_5.form_category.pear.course_ids"
                                )
                                ?.map((_, index) => (
                                  <FormInputField
                                    key={index}
                                    form={form}
                                    name={`section_5.form_category.pear.course_ids.${index}`}
                                    label={`Course ID ${index + 1}`}
                                  />
                                ))}
                            </CardContent>
                          </Card>
                        </TabsContent>

                        {/* Quả táo body type */}
                        <TabsContent value="apple">
                          <Card>
                            <CardHeader>
                              <CardTitle>Quả táo Body Type</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <FormTextareaField
                                form={form}
                                name="section_5.form_category.apple.description"
                                label="Description"
                                rows={4}
                              />
                              {form
                                .watch(
                                  "section_5.form_category.apple.course_ids"
                                )
                                ?.map((_, index) => (
                                  <FormInputField
                                    key={index}
                                    form={form}
                                    name={`section_5.form_category.apple.course_ids.${index}`}
                                    label={`Course ID ${index + 1}`}
                                  />
                                ))}
                            </CardContent>
                          </Card>
                        </TabsContent>

                        {/* Chữ nhật body type */}
                        <TabsContent value="rectangle">
                          <Card>
                            <CardHeader>
                              <CardTitle>Chữ nhật Body Type</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <FormTextareaField
                                form={form}
                                name="section_5.form_category.rectangle.description"
                                label="Description"
                                rows={4}
                              />
                              {form
                                .watch(
                                  "section_5.form_category.rectangle.course_ids"
                                )
                                ?.map((_, index) => (
                                  <FormInputField
                                    key={index}
                                    form={form}
                                    name={`section_5.form_category.rectangle.course_ids.${index}`}
                                    label={`Course ID ${index + 1}`}
                                  />
                                ))}
                            </CardContent>
                          </Card>
                        </TabsContent>

                        {/* Đồng hồ cát body type */}
                        <TabsContent value="hourglass">
                          <Card>
                            <CardHeader>
                              <CardTitle>Đồng hồ cát Body Type</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <FormTextareaField
                                form={form}
                                name="section_5.form_category.hourglass.description"
                                label="Description"
                                rows={4}
                              />
                              {form
                                .watch(
                                  "section_5.form_category.hourglass.course_ids"
                                )
                                ?.map((_, index) => (
                                  <FormInputField
                                    key={index}
                                    form={form}
                                    name={`section_5.form_category.hourglass.course_ids.${index}`}
                                    label={`Course ID ${index + 1}`}
                                  />
                                ))}
                            </CardContent>
                          </Card>
                        </TabsContent>

                        {/* Tam giác ngược body type */}
                        <TabsContent value="inverted_triangle">
                          <Card>
                            <CardHeader>
                              <CardTitle>Tam giác ngược Body Type</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <FormTextareaField
                                form={form}
                                name="section_5.form_category.inverted_triangle.description"
                                label="Description"
                                rows={4}
                              />
                              {form
                                .watch(
                                  "section_5.form_category.inverted_triangle.course_ids"
                                )
                                ?.map((_, index) => (
                                  <FormInputField
                                    key={index}
                                    form={form}
                                    name={`section_5.form_category.inverted_triangle.course_ids.${index}`}
                                    label={`Course ID ${index + 1}`}
                                  />
                                ))}
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
                      <CardTitle>Diet Section</CardTitle>
                      <CardDescription>
                        Edit the diet section content.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormInputField
                        form={form}
                        name="section_7.title"
                        label="Title"
                      />
                      <FormInputField
                        form={form}
                        name="section_7.subtitle"
                        label="Subtitle"
                      />
                      {form.watch("section_7.diet_ids")?.map((_, index) => (
                        <FormInputField
                          key={index}
                          form={form}
                          name={`section_7.diet_ids.${index}`}
                          label={`Diet ID ${index + 1}`}
                        />
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Section 8 */}
                <TabsContent value="section_8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Products Section</CardTitle>
                      <CardDescription>
                        Edit the products section content.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormInputField
                        form={form}
                        name="section_8.title"
                        label="Title"
                      />
                      <FormTextareaField
                        form={form}
                        name="section_8.description"
                        label="Description"
                        rows={4}
                      />
                      {form.watch("section_8.product_ids")?.map((_, index) => (
                        <FormInputField
                          key={index}
                          form={form}
                          name={`section_8.product_ids.${index}`}
                          label={`Product ID ${index + 1}`}
                        />
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Section 9 */}
                <TabsContent value="section_9">
                  <Card>
                    <CardHeader>
                      <CardTitle>Coaches Section</CardTitle>
                      <CardDescription>
                        Edit the coaches section content.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {form.watch("section_9.coacher_ids")?.map((_, index) => (
                        <FormInputField
                          key={index}
                          form={form}
                          name={`section_9.coacher_ids.${index}`}
                          label={`Coach ID ${index + 1}`}
                        />
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Section 10 */}
                <TabsContent value="section_10">
                  <Card>
                    <CardHeader>
                      <CardTitle>FAQ Section</CardTitle>
                      <CardDescription>
                        Edit the FAQ section content.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Card className="p-4">
                        <CardTitle className="mb-4">Top FAQ</CardTitle>
                        <FormInputField
                          form={form}
                          name="section_10.top.title"
                          label="Title"
                        />
                        <FormTextareaField
                          form={form}
                          name="section_10.top.description"
                          label="Description"
                          rows={4}
                        />
                        <FormInputField
                          form={form}
                          name="section_10.top.image"
                          label="Image URL"
                        />
                      </Card>
                      <Card className="p-4">
                        <CardTitle className="mb-4">Bottom FAQ</CardTitle>
                        <FormInputField
                          form={form}
                          name="section_10.bottom.title"
                          label="Title"
                        />
                        <FormTextareaField
                          form={form}
                          name="section_10.bottom.description"
                          label="Description"
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
                      <CardTitle>Footer Image Section</CardTitle>
                      <CardDescription>
                        Edit the footer image section content.
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
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}

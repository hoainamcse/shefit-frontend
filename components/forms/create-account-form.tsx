"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { ColumnDef, DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInputField, FormMultiSelectField } from "@/components/forms/fields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { AddButton } from "@/components/buttons/add-button";
import { useTransition } from "react";
import { MainButton } from "../buttons/main-button";
import { z } from "zod";
import { Account } from "@/models/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const accountSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Account name is required' }),
  phone_number: z.string().min(1, { message: 'Phone number is required' })
    .regex(/^0[0-9]{9,10}$/, { message: 'Invalid phone number format' }),
  username: z.string().min(1, { message: 'Username is required' })
    .regex(/^[a-zA-Z0-9_]{3,30}$/, { message: 'Username must be 3-30 characters and contain only letters, numbers, and underscores' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' })
});

type AccountFormData = z.infer<typeof accountSchema>;
interface CreateAccountFormProps {
  data?: Account
}

type MembershipPackage = {
  id: string;
  name: string;
  month_duration: number;
  start_date: Date;
  end_date: Date;
  gift: string;
};


// Courses
export const courses = [
  {
    value: '1',
    label: 'Dumbbell',
  },
  {
    value: '2',
    label: 'Barbell',
  },
];

// Menu Items
export const menuItems = [
  {
    value: '1',
    label: 'Breakfast',
  },
  {
    value: '2',
    label: 'Lunch',
  }
];

// Exercises
export const exercises = [
  {
    value: '1',
    label: 'Squats',
  },
  {
    value: '2',
    label: 'Push-ups',
  },

];

// Dishes
export const dishes = [
  {
    value: '1',
    label: 'Grilled Chicken Breast',
  },
  {
    value: '2',
    label: 'Quinoa Salad',
  },
  {
    value: '3',
    label: 'Salmon with Asparagus',
  },

];

export default function CreateAccountForm({ data }: CreateAccountFormProps) {
  const [isPending, startTransition] = useTransition()
  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: data || {
      name: '',
      phone_number: '',
      username: '',
      password: ''
    }
  });


  function onSubmit(data: AccountFormData) {
    // startTransition(async () => {
    //   toast.success('Cập nhật tài khoản thành công')
    // })
  }

  // Mock data for membership packages
  const membershipPackages: MembershipPackage[] = [
    {
      id: "1",
      name: "Gói cơ bản",
      month_duration: 3,
      start_date: new Date(),
      end_date: new Date(),
      gift: "Áo tập",
    },
    {
      id: "2",
      name: "Gói nâng cao",
      month_duration: 6,
      start_date: new Date(),
      end_date: new Date(),
      gift: "Bộ dụng cụ tập",
    },
  ];

  const membershipColumns: ColumnDef<MembershipPackage>[] = [
    {
      accessorKey: "id",
      header: "STT",
    },
    {
      accessorKey: "name",
      header: "Tên gói membership",
    },
    {
      accessorKey: "month_duration",
      header: "Thời gian gói (tháng)",
      render: ({ row }) => (
        <Select
          defaultValue={row.month_duration.toString()}
          onValueChange={(value) => {
            // Clear date fields when month is selected
            console.log("Month selected:", value);
            // In a real implementation, you would update the row data
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 3, 6, 12].map((month) => (
              <SelectItem key={month} value={month.toString()}>
                {month} tháng
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "start_date",
      header: "Ngày bắt đầu",
      render: ({ row }) => (
        <input
          type="date"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
          defaultValue={row.start_date.toString()}
          onChange={(e) => console.log("Start date:", e.target.value)}
        />
      ),
    },
    {
      accessorKey: "end_date",
      header: "Ngày kết thúc",
      render: ({ row }) => (
        <input
          type="date"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
          defaultValue={row.end_date.toString()}
          onChange={(e) => console.log("End date:", e.target.value)}
        />
      ),
    },
    {
      accessorKey: "gift",
      header: "Quà tặng",
      render: ({ row }) => (
        <Select defaultValue={row.gift}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Áo tập">Áo tập</SelectItem>
            <SelectItem value="Bộ dụng cụ tập">Bộ dụng cụ tập</SelectItem>
            <SelectItem value="Túi tập">Túi tập</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "actions",
      render: () => (
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  // Function to create header extra content with different text
  const createHeaderExtraContent = (text: string) => (
    <>
      <AddButton text={text} />
    </>
  );

  const membershipHeaderExtraContent = createHeaderExtraContent("Thêm gói membership");
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Account Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Account - STT</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormInputField form={form} name="name" label="Tên" required placeholder="Nhập tên" />
            <FormInputField form={form} name="phone_number" label="Số điện thoại" required placeholder="Nhập số điện thoại" />
            <FormInputField form={form} name="username" label="Username" required placeholder="Nhập username" />
            <FormInputField form={form} name="password" type="password" label="Mật khẩu" required placeholder="Nhập mật khẩu" />
          </div>
        </div>

        {/* Membership Packages */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Gói membership</h2>
          <DataTable
            data={membershipPackages}
            columns={membershipColumns}
            searchPlaceholder="Tìm kiếm gói membership"
            headerExtraContent={membershipHeaderExtraContent}
          />
        </div>

        {/* Assigned Items */}
        <div className="space-y-8">
          <h2 className="text-lg font-semibold">Gán khóa học, thực đơn cho học viên</h2>
          <div className="space-y-4">
            <FormMultiSelectField
              form={form}
              name="course_ids"
              label="Khóa học"
              data={courses}
              placeholder="Chọn khóa học"
            />

            <FormMultiSelectField
              form={form}
              name="menu_ids"
              label="Thực đơn"
              data={menuItems}
              placeholder="Chọn thực đơn"
            />

            <FormMultiSelectField
              form={form}
              name="exercise_ids"
              label="Bài tập"
              data={exercises}
              placeholder="Chọn bài tập"
            />

            <FormMultiSelectField
              form={form}
              name="dish_ids"
              label="Món ăn"
              data={dishes}
              placeholder="Chọn món ăn"
            />

          </div>
        </div>

      <MainButton text="Lưu" className="w-full" loading={isPending} />
      </form>
    </Form>
  );
}
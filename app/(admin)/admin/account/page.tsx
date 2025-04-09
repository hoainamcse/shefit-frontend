"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { AddButton } from "@/components/buttons/add-button";
import { ColumnDef, DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form } from "@/components/ui/form";
import { FormMultiSelectField, FormInputField, FormTextareaField } from '@/components/forms/fields'
import { Copy, Edit, Ellipsis, Eye, Import, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { MainButton } from "@/components/buttons/main-button";
import { equipments, muscleGroups } from "@/components/forms/create-course-form";

type Account = {
  id: string;
  name: string;
  phone_number: string;
  username: string;
  password: string;
  created_date: string;
};


const mockAccounts: Account[] = [
  {
    id: "acc-1",
    name: "Nguyễn Văn A",
    phone_number: "0901234567",
    username: "vana",
    password: "password123",
    created_date: "2022-01-01",
  },
  {
    id: "acc-2",
    name: "Trần Thị B",
    phone_number: "0909876543",
    username: "thib",
    password: "password456",
    created_date: "2022-02-15",
  },
  {
    id: "acc-3",
    name: "Lê Văn C",
    phone_number: "0901112222",
    username: "vanle",
    password: "password789",
    created_date: "2022-03-20",
  },
  {
    id: "acc-4",
    name: "Nguyễn Thị D",
    phone_number: "0903334444",
    username: "thid",
    password: "password012",
    created_date: "2022-04-05",
  },
  {
    id: "acc-5",
    name: "Trần Văn E",
    phone_number: "0905556666",
    username: "vane",
    password: "password345",
    created_date: "2022-05-10",
  },
];

export default function AccountPage() {
  const router = useRouter();
  const columns: ColumnDef<Account>[] = [
    {
      accessorKey: "id",
      header: "STT",
    },
    {
      accessorKey: "name",
      header: "Tên",
    },
    {
      accessorKey: "phone_number",
      header: "SDT",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "created_date",
      header: "Ngày tạo",
    },
    {
      accessorKey: "actions",
      render: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem>
              <Copy /> Sao chép account ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye /> Xem
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/admin/account/${row.id}`)}>
              <Edit /> Cập nhật
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 /> Xoá
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  const headerExtraContent = (
    <>
      <CreateAccountDialog>
        <AddButton
          text="Thêm tài khoản"
        />
      </CreateAccountDialog>
    </>
  );

  return (
    <ContentLayout title="Danh sách tài khoản">
      <DataTable
        headerExtraContent={headerExtraContent}
        searchPlaceholder="Tìm kiếm theo sdt"
        data={mockAccounts}
        columns={columns}
        onSelectChange={() => { }}
      />
    </ContentLayout>
  );
}

function CreateAccountDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm bài tập</DialogTitle>
        </DialogHeader>
        <CreateAccountForm />
      </DialogContent>
    </Dialog>
  )
}

function CreateAccountForm() {
  const form = useForm()
  
  const onSubmit = (data: any) => {
    console.log('Form data:', data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormInputField form={form} name="name" label="Tên" required placeholder="Nhập tên người dùng" />
        <FormInputField 
          form={form} 
          name="phone_number" 
          label="Số điện thoại" 
          required 
          placeholder="Nhập số điện thoại" 
          type="tel"
          pattern="^0[0-9]{9,10}$"
          onInput={(e) => {
            const input = e.target as HTMLInputElement;
            input.value = input.value.replace(/[^0-9]/g, '');
          }}
        />
        <FormInputField form={form} name="username" label="Username" required placeholder="Nhập username" />
        <FormInputField form={form} name="password" type="password" label="Mật khẩu" required placeholder="Nhập mật khẩu" />
        <FormInputField form={form} name="confirm_password" type="password" label="Xác nhận mật khẩu" required placeholder="Nhập lại mật khẩu" />
        <MainButton text="Tạo" className="w-full" />
      </form>
    </Form>
  )
}

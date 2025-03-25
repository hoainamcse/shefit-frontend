import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

const scheduleData = [
  {
    day: "2",
    value: "thu2",
    sessions: [
      { id: 1, name: "Mông Đào", time: "5-6am" },
      { id: 2, name: "Mông Đào", time: "8-9am" },
    ],
  },
  {
    day: "3",
    value: "thu3",
    sessions: [{ id: 1, name: "Mông Đào", time: "6-7am" }],
  },
  {
    day: "4",
    value: "thu4",
    sessions: [
      { id: 1, name: "Mông Đào", time: "7-8am" },
      { id: 2, name: "Mông Đào", time: "9-10am" },
    ],
  },
  {
    day: "5",
    value: "thu5",
    sessions: [{ id: 1, name: "Mông Đào", time: "8-9am" }],
  },
  {
    day: "6",
    value: "thu6",
    sessions: [
      { id: 1, name: "Mông Đào", time: "6-7am" },
      { id: 2, name: "Mông Đào", time: "10-11am" },
    ],
  },
  {
    day: "7",
    value: "thu7",
    sessions: [{ id: 1, name: "Mông Đào", time: "7-8am" }],
  },
]

export default function DetailPage() {
  return (
    <div className="flex flex-col gap-10 mt-10">
      <Tabs defaultValue={scheduleData[0].value} className="[state=active]:bg-[#91EBD5] data-[state=active]:shadow-none">
        <TabsList className="bg-white">
          {scheduleData.map((day) => (
            <TabsTrigger key={day.value} value={day.value} className="p-0 w-16 h-16 text-xl font-medium">
              Thứ <br />
              {day.day}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="ml-2 mt-10">
          {scheduleData.map((day) => (
            <TabsContent
              key={day.value}
              value={day.value}
              className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500 flex flex-col gap-5"
            >
              {day.sessions.map((session) => (
                <div key={session.id} className="flex justify-between">
                  <div>
                    <p className="font-[family-name:var(--font-coiny)] text-[30px] flex gap-2">
                      Ca
                      <span>{session.id}</span>
                    </p>
                    <p className="text-[#737373] text-xl">
                      {session.name} / {session.time}
                    </p>
                  </div>
                  <div className="text-primary text-xl">Vào lớp</div>
                </div>
              ))}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  )
}

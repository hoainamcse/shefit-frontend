import { ContentLayout } from '@/components/admin-panel/content-layout'
import { AIHubTable } from '@/components/data-table/ai-hub-table'
import ChatBotPreview from '@/components/chatbot/chatbot-preview'
import { TokenUsage } from '@/components/chatbot/token-usage'
import { Card, CardContent } from '@/components/ui/card'

export default function AIHubPage() {
  return (
    <ContentLayout title="AI Hub">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-2/3">
          <AIHubTable />
        </div>
        <div className="lg:w-1/3 space-y-4">
          {/* Token Usage Card */}
          <TokenUsage />

          {/* Chatbot Preview Card */}
          <Card>
            <CardContent className="p-0">
              <ChatBotPreview className="h-[450px]" />
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentLayout>
  )
}

"use client";

import { Screen } from "@/components/phone/Screen";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { ConversationRow } from "@/components/messaging/ConversationRow";
import { useConversations } from "@/lib/store";

export default function MessagesPage() {
  const conversations = useConversations();

  return (
    <Screen
      header={<ScreenHeader title="Messages" showBack={false} />}
      activeTab="messages"
      padded={false}
    >
      <div className="divide-y divide-border">
        {conversations.map((conv, i) => (
          <ConversationRow
            key={conv.id}
            conversation={conv}
            unread={i === 0}
          />
        ))}
      </div>
    </Screen>
  );
}

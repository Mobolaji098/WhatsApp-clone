export interface StreamPushEvent {
    type: string
    cid: string
    channel_id: string
    channel_type: string
    message: Message
    channel: Channel
    user: User3
    watcher_count: number
    created_at: string
    message_id: string
    members: Member2[]
    request_info: RequestInfo
  }
  
  export interface Message {
    id: string
    text: string
    html: string
    type: string
    user: User
    attachments: any[]
    latest_reactions: any[]
    own_reactions: any[]
    reaction_counts: ReactionCounts
    reaction_scores: ReactionScores
    reply_count: number
    deleted_reply_count: number
    cid: string
    created_at: string
    updated_at: string
    shadowed: boolean
    mentioned_users: any[]
    silent: boolean
    before_message_send_failed: boolean
    pinned: boolean
    pinned_at: any
    pinned_by: any
    pin_expires: any
  }
  
  export interface User {
    id: string
    role: string
    created_at: string
    updated_at: string
    last_active: string
    banned: boolean
    online: boolean
    name: string
    image: string
  }
  
  export interface ReactionCounts {}
  
  export interface ReactionScores {}
  
  export interface Channel {
    id: string
    type: string
    cid: string
    last_message_at: string
    created_at: string
    updated_at: string
    created_by: CreatedBy
    frozen: boolean
    disabled: boolean
    members: Member[]
    member_count: number
    config: Config
    name: string
  }
  
  export interface CreatedBy {
    id: string
    role: string
    created_at: string
    updated_at: string
    last_active: string
    banned: boolean
    online: boolean
    name: string
    image: string
  }
  
  export interface Member {
    user_id: string
    user: User2
    status: string
    created_at: string
    updated_at: string
    banned: boolean
    shadow_banned: boolean
    role: string
    channel_role: string
    notifications_muted: boolean
  }
  
  export interface User2 {
    id: string
    role: string
    created_at: string
    updated_at: string
    last_active: string
    banned: boolean
    online: boolean
    language?: string
    first_name?: string
    staff_user?: boolean
    dashboard_user?: boolean
    last_name?: string
    name?: string
    image?: string
  }
  
  export interface Config {
    created_at: string
    updated_at: string
    name: string
    typing_events: boolean
    read_events: boolean
    connect_events: boolean
    search: boolean
    reactions: boolean
    replies: boolean
    quotes: boolean
    mutes: boolean
    uploads: boolean
    url_enrichment: boolean
    custom_events: boolean
    push_notifications: boolean
    reminders: boolean
    mark_messages_pending: boolean
    polls: boolean
    message_retention: string
    max_message_length: number
    automod: string
    automod_behavior: string
    commands: Command[]
  }
  
  export interface Command {
    name: string
    description: string
    args: string
    set: string
  }
  
  export interface User3 {
    id: string
    role: string
    created_at: string
    updated_at: string
    last_active: string
    banned: boolean
    online: boolean
    name: string
    image: string
  }
  
  export interface Member2 {
    user_id: string
    user: User4
    status: string
    created_at: string
    updated_at: string
    banned: boolean
    shadow_banned: boolean
    role: string
    channel_role: string
    notifications_muted: boolean
  }
  
  export interface User4 {
    id: string
    role: string
    created_at: string
    updated_at: string
    last_active: string
    banned: boolean
    online: boolean
    language?: string
    dashboard_user?: boolean
    first_name?: string
    channel_unread_count: number
    channel_last_read_at: string
    staff_user?: boolean
    last_name?: string
    total_unread_count: number
    unread_channels: number
    unread_count: number
    name?: string
    image?: string
  }
  
  export interface RequestInfo {
    type: string
    ip: string
    user_agent: string
    sdk: string
  }
  
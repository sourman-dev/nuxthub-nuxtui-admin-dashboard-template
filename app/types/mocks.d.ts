// Mock data type definitions for dashboard UI

export interface User {
  id: number
  name: string
  email: string
  avatar?: {
    src: string
    alt?: string
  }
  status: UserStatus
  location: string
}

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'

export interface Mail {
  id: number
  subject: string
  from: {
    name: string
    email: string
    avatar?: {
      src: string
      alt?: string
    }
  }
  date: string
  body?: string
  unread?: boolean
}

export interface Member {
  id: number
  name: string
  username: string
  email: string
  avatar?: {
    src: string
    alt?: string
  }
  role: 'member' | 'owner'
  date: string
}

export interface Notification {
  id: number
  title: string
  description?: string
  icon?: string
  avatar?: {
    src: string
    alt?: string
  }
  color?: string
  click?: () => void
}

export interface Sale {
  date: string
  amount: number
  status: SaleStatus
}

export type SaleStatus = 'completed' | 'pending' | 'cancelled'

export interface Period {
  label: string
  value: string
}

export interface Range {
  start: Date
  end: Date
}

'use client'

import { useState, useEffect } from 'react'

export interface Device {
  id: string
  name: string
  type: 'DESKTOP' | 'MOBILE' | 'TABLET'
  manufacturer?: string
  model?: string
  os: string
  osVersion: string
  resolution?: string
  isMobile: boolean
  isActive: boolean
  browserDevices: BrowserDevice[]
}

export interface Browser {
  id: string
  name: string
  version: string
  engine?: string
  isMobile: boolean
  isActive: boolean
  browserDevices: BrowserDevice[]
}

export interface BrowserDevice {
  id: string
  deviceId: string
  browserId: string
  isActive: boolean
  device: Device
  browser: Browser
}

export interface TestSession {
  id: string
  userId: string
  browserDeviceId: string
  url?: string
  status: 'CREATED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  startedAt?: Date
  endedAt?: Date
  createdAt: Date
  updatedAt: Date
  browserDevice: BrowserDevice
  user: {
    id: string
    email: string
    name?: string
  }
}

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/devices')
      if (!response.ok) throw new Error('Failed to fetch devices')
      const data = await response.json()
      setDevices(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return { devices, loading, error, refetch: fetchDevices }
}

export function useBrowsers() {
  const [browsers, setBrowsers] = useState<Browser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBrowsers()
  }, [])

  const fetchBrowsers = async () => {
    try {
      const response = await fetch('/api/browsers')
      if (!response.ok) throw new Error('Failed to fetch browsers')
      const data = await response.json()
      setBrowsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return { browsers, loading, error, refetch: fetchBrowsers }
}

export function useSessions() {
  const [sessions, setSessions] = useState<TestSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions')
      if (!response.ok) throw new Error('Failed to fetch sessions')
      const data = await response.json()
      setSessions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createSession = async (data: { 
    userId: string; 
    browserDeviceId?: string; 
    url?: string; 
    appPath?: string; 
    appType?: string 
  }) => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) throw new Error('Failed to create session')
      const newSession = await response.json()
      setSessions(prev => [newSession, ...prev])
      return newSession
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  return { sessions, loading, error, refetch: fetchSessions, createSession }
}
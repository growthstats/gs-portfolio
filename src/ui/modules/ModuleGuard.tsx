'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

type ModuleGuardProps = {
  moduleKey?: string
  moduleType: string
  path?: string
  children: ReactNode
}

type ModuleGuardState = {
  hasError: boolean
}

export default class ModuleGuard extends Component<ModuleGuardProps, ModuleGuardState> {
  state: ModuleGuardState = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('[modules] client render error', {
      moduleType: this.props.moduleType,
      moduleKey: this.props.moduleKey,
      path: this.props.path,
      error,
      info,
    })
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

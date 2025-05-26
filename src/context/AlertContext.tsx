'use client'
import { createContext, useContext, ReactNode } from 'react'
import { Toaster, toast } from 'sonner'

interface ToastOptions {
  description?: string
  style?: React.CSSProperties
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  icon?: React.ReactNode
}

type AlertType = 'default' | 'success' | 'error' | 'info' | 'warning'

interface AlertContextType {
  showAlert: (message: string, type?: AlertType, options?: ToastOptions) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}

interface AlertProviderProps {
  children: ReactNode
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const showAlert = (message: string, type: AlertType = 'default', options: ToastOptions = {}) => {
    switch (type) {
      case 'success':
        toast.success(message, options)
        break
      case 'error':
        toast.error(message, options)
        break
      case 'info':
        toast(message, { ...options })
        break
      case 'warning':
        toast(message, {
          ...options,
          style: { background: '#ffcc00', color: '#000' }
        })
        break
      default:
        toast(message, options)
    }
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Toaster position='top-right' richColors />
    </AlertContext.Provider>
  )
}

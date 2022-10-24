import { ReactNode } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import { FolderIcon, HomeIcon, HandThumbUpIcon, UsersIcon } from '@heroicons/react/24/outline'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const PageLayout: React.FC<{ withDrawer?: boolean; children: ReactNode }> = (props) => {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-none">
        <TopNav />
      </div>

      <div className="flex flex-grow">
        <div className="flex-none">
          <SideNav />
        </div>

        <main className="flex-grow bg-gray-50">{props.children}</main>
      </div>
    </div>
  )
}

const TopNav = () => {
  return (
    <nav className="border-b px-4 py-3">
      <div className="flex items-center justify-between space-x-6">
        <div className="flex flex-1 items-center space-x-6">
          <div className="flex flex-shrink-0 items-center space-x-2">
            <img alt="Sporos DAO Logo" className="block h-8 w-auto" src="/logo192.png" />
            <p className="text-gray-900 font-medium text-base">Sporos DAO</p>
          </div>

          <div className="flex space-x-4">
            <TopNavLink href="#">Discover</TopNavLink>
            <TopNavLink href="#">Start Your Company</TopNavLink>
          </div>
        </div>

        <ConnectButton />
      </div>
    </nav>
  )
}

const TopNavLink: React.FC<{ children: ReactNode; href: string }> = (props) => {
  // TODO
  const isActive = false

  return (
    <a
      href={props.href}
      aria-current={isActive ? 'page' : undefined}
      className={classNames(
        'rounded-md py-2 px-3 inline-flex items-center text-sm font-medium',
        isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900'
      )}
    >
      {props.children}
    </a>
  )
}

const SideNav = () => {
  return (
    <nav className="flex flex-col h-full justify-between p-4 w-72 border-r">
      <div className="space-y-1">
        <SideNavLink href="#" icon={HomeIcon}>
          Sporos DAO
        </SideNavLink>
        <SideNavLink href="#" icon={FolderIcon}>
          Projects
        </SideNavLink>
        <SideNavLink href="#" icon={HandThumbUpIcon}>
          Proposals
        </SideNavLink>
        <SideNavLink href="#" icon={UsersIcon}>
          Members
        </SideNavLink>
      </div>

      <div className="space-y-1">
        <SideNavLink href="#" icon={HomeIcon}>
          Docs
        </SideNavLink>
        <SideNavLink href="#" icon={UsersIcon}>
          Help
        </SideNavLink>
      </div>
    </nav>
  )
}

const SideNavLink: React.FC<{ children: ReactNode; href: string; icon: typeof HomeIcon }> = (props) => {
  // TODO
  const isActive = false

  return (
    <a
      href={props.href}
      className={classNames(
        'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
        isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
    >
      <props.icon
        aria-hidden="true"
        className={classNames(
          'mr-3 flex-shrink-0 h-6 w-6',
          isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
        )}
      />

      {props.children}
    </a>
  )
}

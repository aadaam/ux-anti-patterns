import React, { useState } from 'react';
import { 
  Layout, 
  FileWarning, 
  MessageSquareWarning, 
  PartyPopper, 
  Save, 
  Hourglass,
  Menu,
  X,
  Layers,
  GalleryHorizontal,
  Ghost,
  Bot,
  Filter,
  Table2
} from 'lucide-react';
import { DemoType, DemoConfig } from './types';
import FormFromHell from './demos/FormFromHell';
import JargonFile from './demos/JargonFile';
import ModalFromNowhere from './demos/ModalFromNowhere';
import OverCelebratingTodo from './demos/OverCelebratingTodo';
import HitSave from './demos/HitSave';
import WaitForever from './demos/WaitForever';
import TabsWontSwitch from './demos/TabsWontSwitch';
import TabsParade from './demos/TabsParade';
import EmptySpaces from './demos/EmptySpaces';
import GhostInTheShell from './demos/GhostInTheShell';
import FilterByOne from './demos/FilterByOne';
import ListVsTable from './demos/ListVsTable';
import Tooltip from './components/Tooltip';

const DEMOS: DemoConfig[] = [
  {
    id: DemoType.FORM_FROM_HELL,
    title: "The Form from Hell",
    description: "Validations that hate you.",
    icon: FileWarning
  },
  {
    id: DemoType.JARGON_FILE,
    title: "The Jargon File",
    description: "Error messages written for robots.",
    icon: MessageSquareWarning
  },
  {
    id: DemoType.MODAL_FROM_NOWHERE,
    title: "Modal from Nowhere",
    description: "Interruptions that destroy your flow.",
    icon: Layout
  },
  {
    id: DemoType.OVER_CELEBRATING_TODO,
    title: "Over-Celebrating Todo",
    description: "When positive reinforcement goes too far.",
    icon: PartyPopper
  },
  {
    id: DemoType.HIT_SAVE,
    title: "Hit Save or Die",
    description: "Anxiety-inducing data persistence.",
    icon: Save
  },
  {
    id: DemoType.TABS_WONT_SWITCH,
    title: "Tabs Won't Switch",
    description: "Punishing navigation with data loss.",
    icon: Layers
  },
  {
    id: DemoType.TABS_PARADE,
    title: "Tabs Parade",
    description: "Navigation nightmares with repetitive data.",
    icon: GalleryHorizontal
  },
  {
    id: DemoType.WAIT_FOREVER,
    title: "Wait Forever",
    description: "Blocking the user for 'processing'.",
    icon: Hourglass
  },
  {
    id: DemoType.EMPTY_SPACES,
    title: "Empty Spaces",
    description: "Handling the void: Spinners vs. Skeletons.",
    icon: Ghost
  },
  {
    id: DemoType.GHOST_IN_THE_SHELL,
    title: "Ghost in the Shell",
    description: "AI Chat: Streaming & Tooling vs Blocking.",
    icon: Bot
  },
  {
    id: DemoType.FILTER_BY_ONE,
    title: "Filter by One",
    description: "Global search vs. Explicit column filtering.",
    icon: Filter
  },
  {
    id: DemoType.LIST_VS_TABLE,
    title: "List vs. Table",
    description: "Horizontal scrolling vs. Master-Detail view.",
    icon: Table2
  }
];

export default function App() {
  const [activeDemo, setActiveDemo] = useState<DemoType>(DemoType.FORM_FROM_HELL);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderActiveDemo = () => {
    switch (activeDemo) {
      case DemoType.FORM_FROM_HELL: return <FormFromHell />;
      case DemoType.JARGON_FILE: return <JargonFile />;
      case DemoType.MODAL_FROM_NOWHERE: return <ModalFromNowhere />;
      case DemoType.OVER_CELEBRATING_TODO: return <OverCelebratingTodo />;
      case DemoType.HIT_SAVE: return <HitSave />;
      case DemoType.TABS_WONT_SWITCH: return <TabsWontSwitch />;
      case DemoType.TABS_PARADE: return <TabsParade />;
      case DemoType.WAIT_FOREVER: return <WaitForever />;
      case DemoType.EMPTY_SPACES: return <EmptySpaces />;
      case DemoType.GHOST_IN_THE_SHELL: return <GhostInTheShell />;
      case DemoType.FILTER_BY_ONE: return <FilterByOne />;
      case DemoType.LIST_VS_TABLE: return <ListVsTable />;
      default: return <div className="p-8">Select a demo</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-6 flex justify-between items-center border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            UX Anti-Patterns
          </h1>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
          {DEMOS.map((demo) => (
            <button
              key={demo.id}
              onClick={() => {
                setActiveDemo(demo.id);
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeDemo === demo.id 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <demo.icon size={20} className="mr-3 shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-medium">{demo.title}</div>
                <Tooltip content={demo.description} position="right" variant="light" className="block w-full">
                  <div className="text-xs opacity-70 truncate">{demo.description}</div>
                </Tooltip>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative w-full">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          {renderActiveDemo()}
        </div>
      </main>
    </div>
  );
}
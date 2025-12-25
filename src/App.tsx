import React, { useState } from 'react';
import { useWorkers } from './hooks/useWorkers';
import { useEntries } from './hooks/useEntries';
import { useNotification } from './hooks/useNotification';
import { getYYYYMMDD } from './utils/helpers';
import { handleExport } from './utils/export';
import { NotificationToast } from './components/NotificationToast';
import { TopBar } from './components/TopBar';
import { WorkerManagement } from './components/WorkerManagement';
import { PenaltyRules } from './components/PenaltyRules';
import { EntryForm } from './components/EntryForm';
import type { DayData } from './types';

export default function App() {
  // Global Logic
  const [currentDate, setCurrentDate] = useState(new Date());
  const { workers, addWorker, removeWorker } = useWorkers();
  const { entries, saveEntry, getEntry } = useEntries();
  const { notification, showNotification, hideNotification } = useNotification();

  // Derived State
  const dateKey = getYYYYMMDD(currentDate);
  const currentEntry = getEntry(dateKey);

  // Handlers
  const handleNavigateDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleSaveEntry = (data: DayData) => {
    saveEntry(dateKey, data);
    showNotification("Entry Saved! Moving to next day...", "success");
    handleNavigateDate(1);
  };

  const onExport = () => {
    handleExport(currentDate, workers, entries, showNotification);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8 flex flex-col gap-6 relative">

      {/* Notification Toast */}
      {notification && (
        <NotificationToast notification={notification} onClose={hideNotification} />
      )}

      {/* Top Bar: Title & Period */}
      <TopBar currentDate={currentDate} onDateChange={setCurrentDate} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Col: Management */}
        <div className="space-y-6">
          <WorkerManagement
            workers={workers}
            onAddWorker={addWorker}
            onRemoveWorker={removeWorker}
            onExport={onExport}
          />
          <PenaltyRules />
        </div>

        {/* Center/Right Col: Daily Entry Form */}
        <div className="lg:col-span-2">
          <EntryForm
            currentDate={currentDate}
            entry={currentEntry}
            workers={workers}
            onSave={handleSaveEntry}
            onNavigateDate={handleNavigateDate}
          />
        </div>

      </div>
    </div>
  );
}
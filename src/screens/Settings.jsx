import { useState } from 'react';
import { Bell, Download, Trash2, Info, RefreshCw, Clock } from 'lucide-react';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import { Text } from '../components/design-system/Typography';
import { Container } from '../components/design-system/Container';
import { Switch } from '../components/ui/switch';
import SettingsSection from '../components/SettingsSection';
import ConfirmDialog from '../components/ConfirmDialog';
import usePreferencesStore from '../stores/preferences';
import useProgressStore from '../stores/progress';
import useCollapsibleSections from '../hooks/useCollapsibleSections';

/**
 * Settings Screen
 * Comprehensive settings for voice coaching, notifications, data management, and about info
 */
function Settings() {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showCustomRest, setShowCustomRest] = useState(false);

  // Collapsible sections state - all closed by default
  const { openSections, toggleSection } = useCollapsibleSections({
    practice: false,
    popups: false,
    notifications: false,
    data: false,
    about: false
  });

  // Preferences store
  const {
    restDuration,
    practiceReminders,
    streakAlerts,
    reminderTime,
    yoga,
    breathing,
    setRestDuration,
    setPracticeReminders,
    setStreakAlerts,
    setReminderTime,
    toggleYogaMoodCheck,
    toggleBreathingMoodCheck,
    resetOnboarding,
  } = usePreferencesStore();

  // Progress store
  const { resetProgress, exportData } = useProgressStore();

  // Calculate storage used
  const getStorageSize = () => {
    let total = 0;
    for (let key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return (total / 1024).toFixed(2); // Convert to KB
  };

  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yoga-app-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    resetProgress();
    setShowClearDialog(false);
    // Optionally show a success message
  };

  const handleFeedback = () => {
    window.location.href = 'mailto:feedback@yoga-app.example.com?subject=Yoga App Feedback';
  };

  const handleResetTutorial = () => {
    resetOnboarding();
    // Reload the page to ensure Onboarding component re-renders with new state
    window.location.href = '/';
  };

  return (
    <DefaultLayout
      header={<PageHeader title="Settings" showBack={false} />}
    >
      <Container className="py-6 space-y-4 pb-24">
        {/* Practice Settings Section */}
        <SettingsSection
          id="practice"
          title="Practice Settings"
          subtitle="Customize your practice experience"
          icon={Clock}
          iconBgColor="bg-cream-100"
          isOpen={openSections.practice}
          onToggle={() => toggleSection('practice')}
        >
          {/* Rest Duration Setting */}
          <div className="py-2">
            <div className="mb-3">
              <Text className="text-sage-800 font-medium">Rest Time Between Poses</Text>
              <Text variant="caption" className="text-sage-600">Time to transition between poses</Text>
            </div>

            {/* Preset buttons */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[
                { value: 0, label: 'None' },
                { value: 5, label: '5s' },
                { value: 10, label: '10s' },
                { value: 15, label: '15s' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setRestDuration(option.value);
                    setShowCustomRest(false);
                  }}
                  className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    restDuration === option.value && !showCustomRest
                      ? 'bg-sage-600 text-white shadow-md scale-105'
                      : 'bg-sage-50 text-sage-700 hover:bg-sage-100 hover:scale-105'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Custom button */}
            <button
              onClick={() => setShowCustomRest(!showCustomRest)}
              className={`w-full py-3 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                showCustomRest
                  ? 'bg-sage-600 text-white shadow-md'
                  : 'bg-sage-50 text-sage-700 hover:bg-sage-100'
              }`}
            >
              Custom
            </button>

            {/* Custom Rest Duration Input - shown when Custom is selected */}
            {showCustomRest && (
              <div className="mt-3 p-3 bg-cream-50 rounded-lg border border-cream-200 animate-in fade-in slide-in-from-top-2 duration-300">
                <Text className="text-sage-800 font-medium mb-2 text-sm">Enter Custom Duration</Text>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={restDuration}
                    onChange={(e) => setRestDuration(e.target.value)}
                    placeholder="Enter seconds..."
                    className="w-24 px-3 py-2 border border-sage-200 rounded-lg bg-white text-sage-800 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all"
                  />
                  <Text variant="caption" className="text-sage-600">seconds (0-60)</Text>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-3 p-3 bg-cream-50 rounded-lg border border-cream-200">
              <Text variant="caption" className="text-sage-600">
                {restDuration === 0 && !showCustomRest && 'Poses will transition immediately without rest periods.'}
                {restDuration === 5 && !showCustomRest && 'Short rest periods - great for faster-paced practices.'}
                {restDuration === 10 && !showCustomRest && 'Medium rest periods - balanced for most practices.'}
                {restDuration === 15 && !showCustomRest && 'Longer rest periods - perfect for gentle, restorative sessions.'}
                {showCustomRest && `Custom rest period of ${restDuration} seconds between poses.`}
              </Text>
            </div>
          </div>
        </SettingsSection>

        {/* Popup Preferences Section */}
        <SettingsSection
          id="popups"
          title="Popup Preferences"
          subtitle="Mood tracking and prompts"
          icon={Info}
          iconBgColor="bg-cream-100"
          isOpen={openSections.popups}
          onToggle={() => toggleSection('popups')}
        >
          {/* Yoga Mood Tracking Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Text className="text-sage-800 font-medium">Yoga Mood Tracking</Text>
              <Text variant="caption" className="text-sage-600">Show mood check before/after yoga practice</Text>
            </div>
            <Switch
              checked={yoga.showMoodCheck}
              onCheckedChange={toggleYogaMoodCheck}
            />
          </div>

          <div className="border-t border-sage-100" />

          {/* Breathing Mood Tracking Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Text className="text-sage-800 font-medium">Breathing Mood Tracking</Text>
              <Text variant="caption" className="text-sage-600">Show mood check before/after breathing exercises</Text>
            </div>
            <Switch
              checked={breathing.showMoodCheck}
              onCheckedChange={toggleBreathingMoodCheck}
            />
          </div>
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection
          id="notifications"
          title="Notifications"
          subtitle="Reminders and alerts"
          icon={Bell}
          iconBgColor="bg-gold-100 text-gold-700"
          isOpen={openSections.notifications}
          onToggle={() => toggleSection('notifications')}
        >
          <div className="text-sm text-gold-700 bg-gold-50 p-3 rounded-lg border border-gold-200">
            Note: Notifications are coming in a future update. These settings will be saved for when they are available.
          </div>

          {/* Practice Reminders */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Text className="text-sage-800 font-medium">Practice Reminders</Text>
              <Text variant="caption" className="text-sage-600">Daily reminder to practice</Text>
            </div>
            <Switch
              checked={practiceReminders}
              onCheckedChange={setPracticeReminders}
            />
          </div>

          {/* Reminder Time */}
          {practiceReminders && (
            <div className="py-2">
              <Text className="text-sage-800 font-medium mb-2">Reminder Time</Text>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-4 py-3 border border-sage-200 rounded-lg bg-white text-sage-800 focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all"
              />
            </div>
          )}

          <div className="border-t border-sage-100" />

          {/* Streak Alerts */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Text className="text-sage-800 font-medium">Streak Alerts</Text>
              <Text variant="caption" className="text-sage-600">Get notified about your streak</Text>
            </div>
            <Switch
              checked={streakAlerts}
              onCheckedChange={setStreakAlerts}
            />
          </div>
        </SettingsSection>

        {/* Data & Privacy Section */}
        <SettingsSection
          id="data"
          title="Data & Privacy"
          subtitle="Manage your practice data"
          icon={Info}
          iconBgColor="bg-cream-100"
          isOpen={openSections.data}
          onToggle={() => toggleSection('data')}
        >
          {/* Export Data */}
          <button
            onClick={handleExportData}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-sage-50 transition-all duration-300 group border border-sage-200"
          >
            <div className="p-2 rounded-lg bg-sage-100 text-sage-700 group-hover:bg-sage-200 transition-colors">
              <Download className="h-4 w-4" />
            </div>
            <div className="text-left flex-1">
              <Text className="text-sage-800 font-medium">Export Practice Data</Text>
              <Text variant="caption" className="text-sage-600">Download your history as JSON</Text>
            </div>
          </button>

          {/* Storage Info */}
          <div className="p-3 bg-cream-50 rounded-lg border border-cream-200">
            <Text className="text-sage-800 font-medium">Storage Used</Text>
            <Text variant="caption" className="text-sage-600">{getStorageSize()} KB of local storage</Text>
          </div>

          {/* Clear Data */}
          <button
            onClick={() => setShowClearDialog(true)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-state-error/10 transition-all duration-300 group border border-state-error/30"
          >
            <div className="p-2 rounded-lg bg-state-error/20 text-state-error group-hover:bg-state-error/30 transition-colors">
              <Trash2 className="h-4 w-4" />
            </div>
            <div className="text-left flex-1">
              <Text className="text-state-error font-medium">Clear All Data</Text>
              <Text variant="caption" className="text-state-error">Delete your practice history</Text>
            </div>
          </button>
        </SettingsSection>

        {/* About Section */}
        <SettingsSection
          id="about"
          title="About"
          subtitle="App information and credits"
          icon={Info}
          iconBgColor="bg-sage-100 text-sage-700"
          isOpen={openSections.about}
          onToggle={() => toggleSection('about')}
        >
          <div className="p-3 bg-sage-50 rounded-lg border border-sage-200">
            <Text className="text-sage-800 font-medium">Mindful Yoga App</Text>
            <Text variant="caption" className="text-sage-600">Version 1.0.0 (Beta)</Text>
          </div>

          <div className="p-3 bg-cream-50 rounded-lg border border-cream-200">
            <Text className="text-sage-800 font-medium">Build Date</Text>
            <Text variant="caption" className="text-sage-600">October 2024</Text>
          </div>

          <button
            onClick={handleFeedback}
            className="w-full p-3 rounded-lg hover:bg-sage-50 transition-all duration-300 text-left border border-sage-200 group"
          >
            <Text className="text-sage-800 font-medium group-hover:text-sage-900">Send Feedback</Text>
            <Text variant="caption" className="text-sage-600">Help us improve the app</Text>
          </button>

          <button
            onClick={handleResetTutorial}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-sage-50 transition-all duration-300 group border border-sage-200"
          >
            <div className="p-2 rounded-lg bg-sage-100 text-sage-700 group-hover:bg-sage-200 transition-colors">
              <RefreshCw className="h-4 w-4" />
            </div>
            <div className="text-left flex-1">
              <Text className="text-sage-800 font-medium">Show Tutorial Again</Text>
              <Text variant="caption" className="text-sage-600">Replay the welcome guide</Text>
            </div>
          </button>

          <div className="p-3 bg-cream-50 rounded-lg border border-cream-200">
            <Text className="text-sage-800 font-medium">Credits</Text>
            <Text variant="caption" className="text-sage-600">
              Built with React, Tailwind CSS, and love for yoga
            </Text>
          </div>
        </SettingsSection>
      </Container>

      {/* Clear Data Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={handleClearData}
        title="Clear All Data?"
        message="This will permanently delete all your practice history, streaks, and progress. This action cannot be undone."
        confirmText="Clear Data"
        cancelText="Cancel"
        confirmVariant="danger"
        icon="error"
      />
    </DefaultLayout>
  );
}

export default Settings;

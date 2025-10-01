import { useState } from 'react';
import { Volume2, VolumeX, Bell, Download, Trash2, Info, RefreshCw, ChevronDown } from 'lucide-react';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import { Heading, Text } from '../components/design-system/Typography';
import { Button } from '../components/design-system/Button';
import { Container } from '../components/design-system/Container';
import { Card } from '../components/design-system/Card';
import { Switch } from '../components/ui/switch';
import usePreferencesStore from '../stores/preferences';
import useProgressStore from '../stores/progress';

/**
 * Settings Screen
 * Comprehensive settings for voice coaching, notifications, data management, and about info
 */
function Settings() {
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Collapsible sections state - all closed by default
  const [openSections, setOpenSections] = useState({
    voice: false,
    popups: false,
    notifications: false,
    data: false,
    about: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Preferences store
  const {
    voiceEnabled,
    voicePersonality,
    voiceSpeed,
    voiceVolume,
    practiceReminders,
    streakAlerts,
    reminderTime,
    yoga,
    breathing,
    setVoiceEnabled,
    setVoicePersonality,
    setVoiceSpeed,
    setVoiceVolume,
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
      header={<PageHeader title="Settings" backPath="/" />}
    >
      <Container className="py-6 space-y-4 pb-24">
        {/* Voice Coaching Section */}
        <Card variant="default" padding="none" className="overflow-hidden">
          <button
            onClick={() => toggleSection('voice')}
            className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 hover:bg-sage-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-colors ${voiceEnabled ? 'bg-sage-100 text-sage-700' : 'bg-cream-100 text-sage-400'}`}>
                {voiceEnabled ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </div>
              <div className="text-left">
                <Heading level={3} className="text-sage-800 text-base sm:text-lg">Voice Coaching</Heading>
                <Text variant="caption" className="text-sage-600">Audio guidance and encouragement</Text>
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-sage-500 transition-transform duration-300 ${openSections.voice ? 'rotate-180' : ''}`} />
          </button>

          {openSections.voice && (
            <div className="space-y-4 p-4 sm:p-5 pt-0 border-t border-sage-100 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between py-2">
              <div>
                <Text className="text-sage-800 font-medium">Enable Voice</Text>
                <Text variant="caption" className="text-sage-600">Get audio guidance during practice</Text>
              </div>
              <Switch
                checked={voiceEnabled}
                onCheckedChange={setVoiceEnabled}
              />
            </div>

            <div className="border-t border-sage-100" />

            {/* Voice Personality */}
            <div className="py-2">
              <Text className="text-sage-800 font-medium mb-3">Coaching Personality</Text>
              <div className="grid grid-cols-3 gap-2">
                {['gentle', 'motivational', 'minimal'].map((personality) => (
                  <button
                    key={personality}
                    onClick={() => setVoicePersonality(personality)}
                    disabled={!voiceEnabled}
                    className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      voicePersonality === personality
                        ? 'bg-sage-600 text-white shadow-md scale-105'
                        : voiceEnabled
                          ? 'bg-sage-50 text-sage-700 hover:bg-sage-100 hover:scale-105'
                          : 'bg-cream-100 text-sage-300 cursor-not-allowed'
                    }`}
                  >
                    {personality.charAt(0).toUpperCase() + personality.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-sage-100" />

            {/* Voice Speed */}
            <div className="py-2">
              <div className="flex items-center justify-between mb-3">
                <Text className="text-sage-800 font-medium">Voice Speed</Text>
                <span className="text-sm font-medium text-sage-600 bg-sage-100 px-2 py-1 rounded-md">{voiceSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.1"
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                disabled={!voiceEnabled}
                className="w-full h-2 bg-sage-200 rounded-lg appearance-none cursor-pointer slider accent-sage-600"
              />
              <div className="flex justify-between mt-2">
                <Text variant="caption" className="text-sage-500">Slower</Text>
                <Text variant="caption" className="text-sage-500">Faster</Text>
              </div>
            </div>

            <div className="border-t border-sage-100" />

            {/* Voice Volume */}
            <div className="py-2">
              <div className="flex items-center justify-between mb-3">
                <Text className="text-sage-800 font-medium">Volume</Text>
                <span className="text-sm font-medium text-sage-600 bg-sage-100 px-2 py-1 rounded-md">{Math.round(voiceVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceVolume}
                onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                disabled={!voiceEnabled}
                className="w-full h-2 bg-sage-200 rounded-lg appearance-none cursor-pointer slider accent-sage-600"
              />
              <div className="flex justify-between mt-2">
                <Text variant="caption" className="text-sage-500">Quiet</Text>
                <Text variant="caption" className="text-sage-500">Loud</Text>
              </div>
            </div>
          </div>
          )}
        </Card>

        {/* Popup Preferences Section */}
        <Card variant="default" padding="none" className="overflow-hidden">
          <button
            onClick={() => toggleSection('popups')}
            className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 hover:bg-sage-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cream-100 text-sage-600">
                <Info className="h-5 w-5" />
              </div>
              <div className="text-left">
                <Heading level={3} className="text-sage-800 text-base sm:text-lg">Popup Preferences</Heading>
                <Text variant="caption" className="text-sage-600">Mood tracking and prompts</Text>
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-sage-500 transition-transform duration-300 ${openSections.popups ? 'rotate-180' : ''}`} />
          </button>

          {openSections.popups && (
            <div className="space-y-4 p-4 sm:p-5 pt-0 border-t border-sage-100 animate-in fade-in slide-in-from-top-2 duration-300">
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
            </div>
          )}
        </Card>

        {/* Notifications Section */}
        <Card variant="default" padding="none" className="overflow-hidden">
          <button
            onClick={() => toggleSection('notifications')}
            className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 hover:bg-sage-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold-100 text-gold-700">
                <Bell className="h-5 w-5" />
              </div>
              <div className="text-left">
                <Heading level={3} className="text-sage-800 text-base sm:text-lg">Notifications</Heading>
                <Text variant="caption" className="text-sage-600">Reminders and alerts</Text>
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-sage-500 transition-transform duration-300 ${openSections.notifications ? 'rotate-180' : ''}`} />
          </button>

          {openSections.notifications && (
            <div className="space-y-4 p-4 sm:p-5 pt-0 border-t border-sage-100 animate-in fade-in slide-in-from-top-2 duration-300">
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
            </div>
          )}
        </Card>

        {/* Data & Privacy Section */}
        <Card variant="default" padding="none" className="overflow-hidden">
          <button
            onClick={() => toggleSection('data')}
            className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 hover:bg-sage-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cream-100 text-sage-600">
                <Info className="h-5 w-5" />
              </div>
              <div className="text-left">
                <Heading level={3} className="text-sage-800 text-base sm:text-lg">Data & Privacy</Heading>
                <Text variant="caption" className="text-sage-600">Manage your practice data</Text>
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-sage-500 transition-transform duration-300 ${openSections.data ? 'rotate-180' : ''}`} />
          </button>

          {openSections.data && (
            <div className="space-y-3 p-4 sm:p-5 pt-0 border-t border-sage-100 animate-in fade-in slide-in-from-top-2 duration-300">
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
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-all duration-300 group border border-red-200"
              >
                <div className="p-2 rounded-lg bg-red-100 text-red-700 group-hover:bg-red-200 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </div>
                <div className="text-left flex-1">
                  <Text className="text-red-700 font-medium">Clear All Data</Text>
                  <Text variant="caption" className="text-red-600">Delete your practice history</Text>
                </div>
              </button>
            </div>
          )}
        </Card>

        {/* About Section */}
        <Card variant="default" padding="none" className="overflow-hidden">
          <button
            onClick={() => toggleSection('about')}
            className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 hover:bg-sage-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sage-100 text-sage-700">
                <Info className="h-5 w-5" />
              </div>
              <div className="text-left">
                <Heading level={3} className="text-sage-800 text-base sm:text-lg">About</Heading>
                <Text variant="caption" className="text-sage-600">App information and credits</Text>
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-sage-500 transition-transform duration-300 ${openSections.about ? 'rotate-180' : ''}`} />
          </button>

          {openSections.about && (
            <div className="space-y-3 p-4 sm:p-5 pt-0 border-t border-sage-100 animate-in fade-in slide-in-from-top-2 duration-300">
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
            </div>
          )}
        </Card>
      </Container>

      {/* Clear Data Confirmation Dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <Heading level={2} className="text-sage-800">Clear All Data?</Heading>
            </div>
            <Text className="text-sage-600 mb-6 leading-relaxed">
              This will permanently delete all your practice history, streaks, and progress. This action cannot be undone.
            </Text>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowClearDialog(false)}
                className="flex-1 border-sage-300 hover:bg-sage-50"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleClearData}
                className="flex-1 bg-red-600 hover:bg-red-700 shadow-lg"
              >
                Clear Data
              </Button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}

export default Settings;

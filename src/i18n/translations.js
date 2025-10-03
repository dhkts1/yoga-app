export const translations = {
  en: {
    common: {
      // Navigation
      welcome: "Welcome",
      sessions: "Sessions",
      programs: "Programs",
      breathing: "Breathing",
      insights: "Insights",
      settings: "Settings",
      poses: "Poses",

      // Actions
      start: "Start",
      pause: "Pause",
      resume: "Resume",
      complete: "Complete",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      back: "Back",
      continue: "Continue",
      skip: "Skip",
      next: "Next",
      finish: "Finish",

      // Time
      minutes: "minutes",
      minute: "minute",
      seconds: "seconds",
      second: "second",
      duration: "Duration",
      min: "min",
      sec: "sec",

      // Common phrases
      loading: "Loading...",
      error: "Error",
      success: "Success",
      day: "day",
      days: "days",
      week: "week",
      weeks: "weeks",
      streak: "streak",
      of: "of"
    },

    screens: {
      welcome: {
        goodMorning: "Good Morning",
        goodAfternoon: "Good Afternoon",
        goodEvening: "Good Evening",
        quickStart: "Quick Start",
        browseAll: "Browse All Sessions",
        discoverPrograms: "Discover Multi-Week Programs",
        programsDescription: "Build a deeper practice with structured 8-13 week yoga journeys",
        recentlyPracticed: "Recently Practiced",
        yourProgram: "Your Program",
        continueJourney: "Continue your journey",
        dayStreak: "day streak",
        milestoneCelebration: "Day Streak!"
      },

      sessions: {
        title: "Choose Your Practice",
        subtitle: "Yoga sessions for every moment",
        recommendedForYou: "Recommended for You",
        favoriteCustomSessions: "Favorite Custom Sessions",
        yourCustomSessions: "Your Custom Sessions",
        favoriteSessions: "Favorite Sessions",
        moreSessions: "More Sessions",
        prebuiltSessions: "Pre-built Sessions",
        deleteSessionTitle: "Delete Custom Session?",
        deleteSessionMessage: "This action cannot be undone. Your custom session will be permanently deleted.",
        createCustom: "Create custom session",
        recommended: "Recommended",
        browseAll: "Browse All Sessions",
        favorites: "Favorites",
        custom: "Create Custom",
        duration: "Duration",
        poses: "poses",
        noSessions: "No sessions available",
        selectSession: "Select a session to begin your practice"
      },

      practice: {
        sessionNotFound: "Session not found",
        backToSessions: "← Back to Sessions",
        loadingPose: "Loading pose...",
        howFeelingBefore: "How are you feeling before practice?",
        howFeelingAfter: "How do you feel after your practice?",
        skipMood: "Skip",
        dontShowAgain: "Don't show again",
        restTransition: "Rest & Transition",
        prepareNext: "Take a moment to prepare for the next pose",
        secondsRemaining: "seconds remaining",
        nextPoseLabel: "Next Pose:",
        skipRest: "Skip Rest",
        rightSide: "Right Side",
        leftSide: "Left Side",
        poseOf: "Pose {current} of {total}",
        remaining: "remaining",
        closeTips: "Close tips",
        showTips: "Show tips",
        getTips: "Get form tips and alignment cues",
        getReady: "Get Ready",
        nextPose: "Next Pose",
        finalPose: "Final Pose",
        pausePractice: "Pause Practice",
        resumePractice: "Resume Practice",
        endPractice: "End Practice",
        hold: "Hold",
        rest: "Rest",
        breathe: "Breathe"
      },

      complete: {
        breathingComplete: "{name}",
        beautifulWork: "Beautiful work!",
        journeyStep: "You've taken an important step in your mindfulness journey",
        backToHome: "Back to Home",
        practiceAgain: "Practice Again",
        weekComplete: "Week Complete!",
        milestoneAchievement: "🎉 Milestone Achievement!",
        completedSessions: "You completed all recommended sessions for this week ({count} sessions total)",
        significantMilestone: "This is a significant milestone in your journey!",
        title: "Practice Complete!",
        wellDone: "Well done!",
        duration: "Duration",
        poses: "Poses",
        howDoYouFeel: "How do you feel?",
        finish: "Finish",
        energy: "Energy",
        mood: "Mood",
        before: "Before",
        after: "After"
      },

      programs: {
        title: "Multi-Week Programs",
        subtitle: "Structured yoga journeys",
        beginJourney: "Begin Your Journey",
        chooseProgramDescription: "Choose a multi-week program to deepen your practice with carefully sequenced sessions. Each week builds on the previous, guiding you through progressive learning.",
        progressiveLearning: "Progressive learning",
        by: "by",
        weekOf: "Week {current} of {total}"
      },

      programDetail: {
        weeks: "{count} weeks",
        sessionsPerWeek: "{count} sessions per week",
        startProgram: "Start Program",
        resumeProgram: "Resume Program",
        pauseProgram: "Pause Program",
        programPaused: "Program Paused",
        programActive: "Program Active",
        overviewTitle: "Program Overview",
        weeklyBreakdown: "Weekly Breakdown",
        completed: "Completed",
        current: "Current",
        locked: "Locked"
      },

      weekDetail: {
        weekNumber: "Week {number}",
        sessionsThisWeek: "Sessions This Week",
        recommended: "Recommended",
        completed: "Completed",
        startSession: "Start Session",
        resumeSession: "Resume",
        sessionDuration: "{duration} min",
        posesCount: "{count} poses",
        completionStatus: "{completed} of {total} completed"
      },

      insights: {
        title: "Practice Insights",
        subtitle: "Your mindful journey analytics",
        morePracticeNeeded: "More Practice Needed",
        unlockInsights: "Complete at least 5 sessions to unlock your insights dashboard. You're {count} session{plural} away!",
        startPracticing: "Start Practicing",
        totalSessions: "Total Sessions",
        thisWeek: "this week",
        totalMinutes: "Total Minutes",
        thisMonth: "this month",
        averageLength: "Average Length",
        perSession: "Per session",
        currentStreak: "Current Streak",
        best: "Best: {count} days",
        practiceFrequency: "Practice Frequency (Last 30 Days)",
        mostPracticedPoses: "Most Practiced Poses",
        favoriteSessions: "Favorite Sessions",
        practiceTimeDistribution: "Practice Time Distribution",
        bodyPartFocus: "Body Part Focus",
        moodImprovement: "Mood Improvement",
        energyBoost: "Energy Boost",
        wellbeingSessions: "Wellbeing Sessions",
        sessionsWithTracking: "Sessions with mood tracking",
        yourInsights: "Your Practice Insights",
        consistencyMessage: "🌟 You're practicing {avg} times per day on average this month - great consistency!",
        favoriteTimeMessage: "⏰ You're most energetic during {time} - {count} of your sessions happen then.",
        topPoseMessage: "🧘 Your go-to pose is {pose} - you've practiced it {count} times.",
        longestStreakMessage: "🔥 Your longest streak of {count} days shows real dedication to your practice.",
        moodImprovementMessage: "💙 Practice consistently improves your mood by {improvement} points on average.",
        sessionsImproved: "{percent}% sessions improved mood",
        exportPDF: "Export PDF"
      },

      breathing: {
        title: "Breathing Exercises",
        subtitle: "Calm your mind with guided breathing",
        selectExercise: "Select an exercise to begin",
        recommended: "Recommended",
        beginner: "Beginner",
        intermediate: "Intermediate",
        advanced: "Advanced"
      },

      breathingPractice: {
        inhale: "Inhale",
        exhale: "Exhale",
        hold: "Hold",
        getReady: "Get Ready...",
        breathingComplete: "Breathing Exercise Complete!",
        rounds: "Rounds",
        duration: "Duration"
      },

      sessionDetail: {
        preview: "Session Preview",
        aboutSession: "About This Session",
        difficulty: "Difficulty",
        category: "Category",
        duration: "Duration",
        poses: "Poses",
        startPractice: "Start Practice",
        favorite: "Favorite",
        edit: "Edit",
        delete: "Delete"
      },

      sessionBuilder: {
        title: "Create Custom Session",
        editTitle: "Edit Custom Session",
        sessionName: "Session Name",
        sessionNamePlaceholder: "Enter session name...",
        difficulty: "Difficulty",
        category: "Category",
        selectPoses: "Select Poses",
        selectedPoses: "Selected Poses ({count})",
        totalDuration: "Total Duration: {duration} min",
        savePractice: "Save & Practice",
        saveSession: "Save Session",
        noPosesSelected: "No poses selected yet. Add poses to create your session.",
        searchPoses: "Search poses..."
      },

      poseLibrary: {
        title: "Pose Library",
        subtitle: "Explore all yoga poses",
        searchPlaceholder: "Search poses...",
        filterByCategory: "Filter by Category",
        filterByDifficulty: "Filter by Difficulty",
        allPoses: "All Poses",
        standing: "Standing",
        seated: "Seated",
        backbend: "Backbend",
        forward: "Forward Fold",
        twist: "Twist",
        balance: "Balance",
        beginner: "Beginner",
        intermediate: "Intermediate",
        advanced: "Advanced"
      },

      settings: {
        title: "Settings",
        language: "Language",
        appearance: "Appearance",
        practice: "Practice",
        notifications: "Notifications",
        data: "Data & Privacy",
        about: "About",

        // Language section
        languageSubtitle: "Choose your preferred language",
        english: "English",
        hebrew: "Hebrew",

        // Appearance section
        appearanceSubtitle: "Choose your preferred theme",
        theme: "Theme",
        light: "Light",
        dark: "Dark",

        // Practice section
        practiceSubtitle: "Customize your practice experience",
        restTime: "Rest Time Between Poses",
        restTimeDescription: "Time to transition between poses",
        none: "None",
        custom: "Custom",
        customDuration: "Enter Custom Duration",
        secondsRange: "seconds (0-60)",
        restDescriptions: {
          none: "Poses will transition immediately without rest periods.",
          short: "Short rest periods - great for faster-paced practices.",
          medium: "Medium rest periods - balanced for most practices.",
          long: "Longer rest periods - perfect for gentle, restorative sessions.",
          custom: "Custom rest period of {duration} seconds between poses."
        },

        // Popups section
        popupsTitle: "Popup Preferences",
        popupsSubtitle: "Mood tracking and prompts",
        yogaMoodTracking: "Yoga Mood Tracking",
        yogaMoodDescription: "Show mood check before/after yoga practice",
        breathingMoodTracking: "Breathing Mood Tracking",
        breathingMoodDescription: "Show mood check before/after breathing exercises",

        // Notifications section
        notificationsSubtitle: "Reminders and alerts",
        notificationNote: "Note: Notifications are coming in a future update. These settings will be saved for when they are available.",
        practiceReminders: "Practice Reminders",
        practiceRemindersDescription: "Daily reminder to practice",
        reminderTime: "Reminder Time",
        streakAlerts: "Streak Alerts",
        streakAlertsDescription: "Get notified about your streak",

        // Data & Privacy section
        dataSubtitle: "Manage your practice data",
        exportData: "Export Practice Data",
        exportDataDescription: "Download your history as JSON",
        storageUsed: "Storage Used",
        storageAmount: "{amount} KB of local storage",
        clearData: "Clear All Data",
        clearDataDescription: "Delete your practice history",
        clearDataConfirm: "This will permanently delete all your practice history, streaks, and progress. This action cannot be undone.",
        clearDataTitle: "Clear All Data?",

        // About section
        aboutSubtitle: "App information and credits",
        appName: "Mindful Yoga App",
        version: "Version 1.0.0 (Beta)",
        buildDate: "Build Date",
        buildMonth: "October 2024",
        sendFeedback: "Send Feedback",
        feedbackDescription: "Help us improve the app",
        showTutorial: "Show Tutorial Again",
        tutorialDescription: "Replay the welcome guide",
        credits: "Credits",
        creditsDescription: "Built with React, Tailwind CSS, and love for yoga"
      }
    },

    poses: {
      "mountain-pose": {
        name: "Mountain Pose",
        sanskrit: "Tadasana",
        description: "The foundation of all standing poses, teaching grounding and centering."
      },
      "downward-dog": {
        name: "Downward-Facing Dog",
        sanskrit: "Adho Mukha Svanasana",
        description: "One of the most recognized yoga poses, both energizing and restorative."
      },
      "warrior-one": {
        name: "Warrior I",
        sanskrit: "Virabhadrasana I",
        description: "A powerful standing pose that builds focus, power, and stability."
      },
      "warrior-two": {
        name: "Warrior II",
        sanskrit: "Virabhadrasana II",
        description: "A pose of strength and grace, cultivating concentration while strengthening the legs."
      },
      "tree-pose": {
        name: "Tree Pose",
        sanskrit: "Vrksasana",
        description: "Teaches us to find balance and grace while remaining grounded."
      },
      "triangle-pose": {
        name: "Triangle Pose",
        sanskrit: "Trikonasana",
        description: "A standing pose that stretches and strengthens the entire body."
      },
      "child-pose": {
        name: "Child's Pose",
        sanskrit: "Balasana",
        description: "A restful pose that gently stretches the body while calming the mind."
      },
      "cat-cow": {
        name: "Cat-Cow Stretch",
        sanskrit: "Marjaryasana-Bitilasana",
        description: "A gentle flow between two poses that warms up the body."
      },
      "cobra-pose": {
        name: "Cobra Pose",
        sanskrit: "Bhujangasana",
        description: "A gentle backbend that strengthens the spine and opens the chest."
      },
      "bridge-pose": {
        name: "Bridge Pose",
        sanskrit: "Setu Bandha Sarvangasana",
        description: "An energizing backbend that opens the chest and strengthens the legs."
      },
      "seated-forward-fold": {
        name: "Seated Forward Fold",
        sanskrit: "Paschimottanasana",
        description: "A calming forward fold that stretches the entire back body."
      },
      "corpse-pose": {
        name: "Corpse Pose",
        sanskrit: "Savasana",
        description: "The most important pose in yoga, allowing the body to absorb the benefits of practice."
      }
    }
  },

  he: {
    common: {
      // Navigation
      welcome: "ברוכים הבאים",
      sessions: "אימונים",
      programs: "תוכניות",
      breathing: "נשימות",
      insights: "תובנות",
      settings: "הגדרות",
      poses: "תנוחות",

      // Actions
      start: "התחל",
      pause: "השהה",
      resume: "המשך",
      complete: "סיים",
      cancel: "ביטול",
      save: "שמור",
      delete: "מחק",
      edit: "ערוך",
      back: "חזור",
      continue: "המשך",
      skip: "דלג",
      next: "הבא",
      finish: "סיים",

      // Time
      minutes: "דקות",
      minute: "דקה",
      seconds: "שניות",
      second: "שנייה",
      duration: "משך זמן",
      min: "דק׳",
      sec: "שנ׳",

      // Common phrases
      loading: "טוען...",
      error: "שגיאה",
      success: "הצלחה",
      day: "יום",
      days: "ימים",
      week: "שבוע",
      weeks: "שבועות",
      streak: "רצף",
      of: "מתוך"
    },

    screens: {
      welcome: {
        goodMorning: "בוקר טוב",
        goodAfternoon: "צהריים טובים",
        goodEvening: "ערב טוב",
        quickStart: "התחלה מהירה",
        browseAll: "עיין בכל האימונים",
        discoverPrograms: "גלה תוכניות רב-שבועיות",
        programsDescription: "בנה תרגול עמוק יותר עם מסעות יוגה מובנים של 8-13 שבועות",
        recentlyPracticed: "תרגלת לאחרונה",
        yourProgram: "התוכנית שלך",
        continueJourney: "המשך את המסע שלך",
        dayStreak: "רצף ימים",
        milestoneCelebration: "רצף ימים!"
      },

      sessions: {
        title: "בחר את התרגול שלך",
        subtitle: "אימוני יוגה לכל רגע",
        recommendedForYou: "מומלץ עבורך",
        favoriteCustomSessions: "אימונים מותאמים מועדפים",
        yourCustomSessions: "האימונים המותאמים שלך",
        favoriteSessions: "אימונים מועדפים",
        moreSessions: "אימונים נוספים",
        prebuiltSessions: "אימונים קבועים מראש",
        deleteSessionTitle: "למחוק אימון מותאם?",
        deleteSessionMessage: "לא ניתן לבטל פעולה זו. האימון המותאם שלך יימחק לצמיתות.",
        createCustom: "צור אימון מותאם",
        recommended: "מומלץ",
        browseAll: "עיין בכל האימונים",
        favorites: "מועדפים",
        custom: "צור אימון מותאם",
        duration: "משך זמן",
        poses: "תנוחות",
        noSessions: "אין אימונים זמינים",
        selectSession: "בחר אימון כדי להתחיל את התרגול שלך"
      },

      practice: {
        sessionNotFound: "אימון לא נמצא",
        backToSessions: "← חזרה לאימונים",
        loadingPose: "טוען תנוחה...",
        howFeelingBefore: "איך אתה מרגיש לפני התרגול?",
        howFeelingAfter: "איך אתה מרגיש אחרי התרגול?",
        skipMood: "דלג",
        dontShowAgain: "אל תציג שוב",
        restTransition: "מנוחה ומעבר",
        prepareNext: "קח רגע להתכונן לתנוחה הבאה",
        secondsRemaining: "שניות נותרו",
        nextPoseLabel: "תנוחה הבאה:",
        skipRest: "דלג על מנוחה",
        rightSide: "צד ימין",
        leftSide: "צד שמאל",
        poseOf: "תנוחה {current} מתוך {total}",
        remaining: "נותרו",
        closeTips: "סגור טיפים",
        showTips: "הצג טיפים",
        getTips: "קבל טיפים ליישור ותנוחה נכונה",
        getReady: "התכונן",
        nextPose: "תנוחה הבאה",
        finalPose: "תנוחה אחרונה",
        pausePractice: "השהה תרגול",
        resumePractice: "המשך תרגול",
        endPractice: "סיים תרגול",
        hold: "החזק",
        rest: "מנוחה",
        breathe: "נשום"
      },

      complete: {
        breathingComplete: "{name}",
        beautifulWork: "עבודה יפה!",
        journeyStep: "לקחת צעד חשוב במסע המיינדפולנס שלך",
        backToHome: "חזרה לדף הבית",
        practiceAgain: "תרגל שוב",
        weekComplete: "השבוע הושלם!",
        milestoneAchievement: "🎉 השגת אבן דרך!",
        completedSessions: "השלמת את כל האימונים המומלצים לשבוע זה ({count} אימונים בסך הכל)",
        significantMilestone: "זו אבן דרך משמעותית במסע שלך!",
        title: "התרגול הושלם!",
        wellDone: "כל הכבוד!",
        duration: "משך זמן",
        poses: "תנוחות",
        howDoYouFeel: "איך אתה מרגיש?",
        finish: "סיים",
        energy: "אנרגיה",
        mood: "מצב רוח",
        before: "לפני",
        after: "אחרי"
      },

      programs: {
        title: "תוכניות רב-שבועיות",
        subtitle: "מסעות יוגה מובנים",
        beginJourney: "התחל את המסע שלך",
        chooseProgramDescription: "בחר תוכנית רב-שבועית להעמקת התרגול שלך עם אימונים מסודרים בקפידה. כל שבוע בונה על הקודם, מדריך אותך בלמידה מתקדמת.",
        progressiveLearning: "למידה מתקדמת",
        by: "מאת",
        weekOf: "שבוע {current} מתוך {total}"
      },

      programDetail: {
        weeks: "{count} שבועות",
        sessionsPerWeek: "{count} אימונים בשבוע",
        startProgram: "התחל תוכנית",
        resumeProgram: "המשך תוכנית",
        pauseProgram: "השהה תוכנית",
        programPaused: "תוכנית מושהית",
        programActive: "תוכנית פעילה",
        overviewTitle: "סקירת התוכנית",
        weeklyBreakdown: "פירוט שבועי",
        completed: "הושלם",
        current: "נוכחי",
        locked: "נעול"
      },

      weekDetail: {
        weekNumber: "שבוע {number}",
        sessionsThisWeek: "אימונים השבוע",
        recommended: "מומלץ",
        completed: "הושלם",
        startSession: "התחל אימון",
        resumeSession: "המשך",
        sessionDuration: "{duration} דק׳",
        posesCount: "{count} תנוחות",
        completionStatus: "{completed} מתוך {total} הושלמו"
      },

      insights: {
        title: "תובנות תרגול",
        subtitle: "אנליטיקה של המסע המיינדפול שלך",
        morePracticeNeeded: "נדרש תרגול נוסף",
        unlockInsights: "השלם לפחות 5 אימונים כדי לפתוח את לוח התובנות שלך. נותרו לך {count} אימון{plural}!",
        startPracticing: "התחל לתרגל",
        totalSessions: "סה״כ אימונים",
        thisWeek: "השבוע",
        totalMinutes: "סה״כ דקות",
        thisMonth: "החודש",
        averageLength: "אורך ממוצע",
        perSession: "לאימון",
        currentStreak: "רצף נוכחי",
        best: "הטוב ביותר: {count} ימים",
        practiceFrequency: "תדירות תרגול (30 ימים אחרונים)",
        mostPracticedPoses: "תנוחות מתורגלות ביותר",
        favoriteSessions: "אימונים מועדפים",
        practiceTimeDistribution: "התפלגות זמן תרגול",
        bodyPartFocus: "התמקדות חלקי גוף",
        moodImprovement: "שיפור במצב רוח",
        energyBoost: "עלייה באנרגיה",
        wellbeingSessions: "אימוני רווחה",
        sessionsWithTracking: "אימונים עם מעקב מצב רוח",
        yourInsights: "תובנות התרגול שלך",
        consistencyMessage: "🌟 אתה מתרגל {avg} פעמים ביום בממוצע החודש - עקביות מעולה!",
        favoriteTimeMessage: "⏰ אתה הכי אנרגטי במהלך {time} - {count} מהאימונים שלך מתרחשים אז.",
        topPoseMessage: "🧘 התנוחה האהובה עליך היא {pose} - תרגלת אותה {count} פעמים.",
        longestStreakMessage: "🔥 הרצף הארוך ביותר שלך של {count} ימים מראה מסירות אמיתית לתרגול שלך.",
        moodImprovementMessage: "💙 תרגול משפר באופן עקבי את מצב הרוח שלך בממוצע ב-{improvement} נקודות.",
        sessionsImproved: "{percent}% מהאימונים שיפרו את מצב הרוח",
        exportPDF: "ייצוא PDF"
      },

      breathing: {
        title: "תרגילי נשימה",
        subtitle: "הרגע את המוח שלך עם נשימה מודרכת",
        selectExercise: "בחר תרגיל כדי להתחיל",
        recommended: "מומלץ",
        beginner: "מתחיל",
        intermediate: "בינוני",
        advanced: "מתקדם"
      },

      breathingPractice: {
        inhale: "שאיפה",
        exhale: "נשיפה",
        hold: "החזק",
        getReady: "התכונן...",
        breathingComplete: "תרגיל הנשימה הושלם!",
        rounds: "סיבובים",
        duration: "משך זמן"
      },

      sessionDetail: {
        preview: "תצוגה מקדימה של אימון",
        aboutSession: "אודות אימון זה",
        difficulty: "רמת קושי",
        category: "קטגוריה",
        duration: "משך זמן",
        poses: "תנוחות",
        startPractice: "התחל תרגול",
        favorite: "מועדף",
        edit: "ערוך",
        delete: "מחק"
      },

      sessionBuilder: {
        title: "צור אימון מותאם",
        editTitle: "ערוך אימון מותאם",
        sessionName: "שם האימון",
        sessionNamePlaceholder: "הזן שם אימון...",
        difficulty: "רמת קושי",
        category: "קטגוריה",
        selectPoses: "בחר תנוחות",
        selectedPoses: "תנוחות נבחרות ({count})",
        totalDuration: "משך זמן כולל: {duration} דק׳",
        savePractice: "שמור ותרגל",
        saveSession: "שמור אימון",
        noPosesSelected: "טרם נבחרו תנוחות. הוסף תנוחות כדי ליצור את האימון שלך.",
        searchPoses: "חפש תנוחות..."
      },

      poseLibrary: {
        title: "ספריית תנוחות",
        subtitle: "גלה את כל תנוחות היוגה",
        searchPlaceholder: "חפש תנוחות...",
        filterByCategory: "סנן לפי קטגוריה",
        filterByDifficulty: "סנן לפי רמת קושי",
        allPoses: "כל התנוחות",
        standing: "עמידה",
        seated: "ישיבה",
        backbend: "כיפוף גב",
        forward: "כיפוף קדימה",
        twist: "פיתול",
        balance: "איזון",
        beginner: "מתחיל",
        intermediate: "בינוני",
        advanced: "מתקדם"
      },

      settings: {
        title: "הגדרות",
        language: "שפה",
        appearance: "מראה",
        practice: "תרגול",
        notifications: "התראות",
        data: "נתונים ופרטיות",
        about: "אודות",

        // Language section
        languageSubtitle: "בחר את השפה המועדפת עליך",
        english: "English",
        hebrew: "עברית",

        // Appearance section
        appearanceSubtitle: "בחר את העיצוב המועדף עליך",
        theme: "עיצוב",
        light: "בהיר",
        dark: "כהה",

        // Practice section
        practiceSubtitle: "התאם אישית את חוויית התרגול שלך",
        restTime: "זמן מנוחה בין תנוחות",
        restTimeDescription: "זמן למעבר בין תנוחות",
        none: "ללא",
        custom: "מותאם אישית",
        customDuration: "הזן משך זמן מותאם",
        secondsRange: "שניות (0-60)",
        restDescriptions: {
          none: "התנוחות יעברו באופן מיידי ללא תקופות מנוחה.",
          short: "תקופות מנוחה קצרות - נהדר לתרגולים מהירים.",
          medium: "תקופות מנוחה בינוניות - מאוזן לרוב התרגולים.",
          long: "תקופות מנוחה ארוכות יותר - מושלם לאימונים עדינים ומשקמים.",
          custom: "תקופת מנוחה מותאמת של {duration} שניות בין תנוחות."
        },

        // Popups section
        popupsTitle: "העדפות חלונות קופצים",
        popupsSubtitle: "מעקב אחר מצב רוח והנחיות",
        yogaMoodTracking: "מעקב מצב רוח ביוגה",
        yogaMoodDescription: "הצג בדיקת מצב רוח לפני/אחרי תרגול יוגה",
        breathingMoodTracking: "מעקב מצב רוח בנשימות",
        breathingMoodDescription: "הצג בדיקת מצב רוח לפני/אחרי תרגילי נשימה",

        // Notifications section
        notificationsSubtitle: "תזכורות והתראות",
        notificationNote: "הערה: התראות יגיעו בעדכון עתידי. הגדרות אלה יישמרו עד אז.",
        practiceReminders: "תזכורות תרגול",
        practiceRemindersDescription: "תזכורת יומית לתרגול",
        reminderTime: "שעת תזכורת",
        streakAlerts: "התראות רצף",
        streakAlertsDescription: "קבל התראה על הרצף שלך",

        // Data & Privacy section
        dataSubtitle: "נהל את נתוני התרגול שלך",
        exportData: "ייצוא נתוני תרגול",
        exportDataDescription: "הורד את ההיסטוריה שלך כ-JSON",
        storageUsed: "אחסון בשימוש",
        storageAmount: "{amount} KB של אחסון מקומי",
        clearData: "נקה את כל הנתונים",
        clearDataDescription: "מחק את היסטוריית התרגול שלך",
        clearDataConfirm: "פעולה זו תמחק לצמיתות את כל היסטוריית התרגול, הרצפים וההתקדמות שלך. לא ניתן לבטל פעולה זו.",
        clearDataTitle: "למחוק את כל הנתונים?",

        // About section
        aboutSubtitle: "מידע על האפליקציה והקרדיטים",
        appName: "אפליקציית יוגה מיינדפול",
        version: "גרסה 1.0.0 (בטא)",
        buildDate: "תאריך בנייה",
        buildMonth: "אוקטובר 2024",
        sendFeedback: "שלח משוב",
        feedbackDescription: "עזור לנו לשפר את האפליקציה",
        showTutorial: "הצג שוב את המדריך",
        tutorialDescription: "הפעל מחדש את מדריך הפתיחה",
        credits: "קרדיטים",
        creditsDescription: "נבנה עם React, Tailwind CSS, ואהבה ליוגה"
      }
    },

    poses: {
      "mountain-pose": {
        name: "תנוחת ההר",
        sanskrit: "טאדאסנה",
        description: "הבסיס לכל תנוחות העמידה, מלמד איזון וריכוז."
      },
      "downward-dog": {
        name: "כלב פונה מטה",
        sanskrit: "אדהו מוקה שבאנסנה",
        description: "אחת מתנוחות היוגה המוכרות ביותר, מרעננת ומשקמת כאחד."
      },
      "warrior-one": {
        name: "לוחם 1",
        sanskrit: "וירבהדראסנה 1",
        description: "תנוחת עמידה חזקה שבונה מיקוד, כוח ויציבות."
      },
      "warrior-two": {
        name: "לוחם 2",
        sanskrit: "וירבהדראסנה 2",
        description: "תנוחה של כוח וחן, מטפחת ריכוז תוך חיזוק הרגליים."
      },
      "tree-pose": {
        name: "תנוחת העץ",
        sanskrit: "ורקסאסנה",
        description: "מלמדת אותנו למצוא איזון וחן תוך שמירה על קרקעיות."
      },
      "triangle-pose": {
        name: "תנוחת המשולש",
        sanskrit: "טריקונאסנה",
        description: "תנוחת עמידה שמותחת ומחזקת את כל הגוף."
      },
      "child-pose": {
        name: "תנוחת הילד",
        sanskrit: "באלאסנה",
        description: "תנוחת מנוחה שמותחת בעדינות את הגוף תוך הרגעת המוח."
      },
      "cat-cow": {
        name: "חתול-פרה",
        sanskrit: "מרג'ריאסנה-ביטילאסנה",
        description: "זרימה עדינה בין שתי תנוחות שמחממת את הגוף."
      },
      "cobra-pose": {
        name: "תנוחת הקוברה",
        sanskrit: "בהוג'נגאסנה",
        description: "כיפוף גב עדין שמחזק את עמוד השדרה ופותח את החזה."
      },
      "bridge-pose": {
        name: "תנוחת הגשר",
        sanskrit: "סטו בנדהה סרוונגאסנה",
        description: "כיפוף גב מרענן שפותח את החזה ומחזק את הרגליים."
      },
      "seated-forward-fold": {
        name: "כיפוף קדימה בישיבה",
        sanskrit: "פשצ׳ימוטאנאסנה",
        description: "כיפוף קדימה מרגיע שמותח את כל החלק האחורי של הגוף."
      },
      "corpse-pose": {
        name: "תנוחת הגופה",
        sanskrit: "שבאסנה",
        description: "התנוחה החשובה ביותר ביוגה, מאפשרת לגוף לספוג את יתרונות התרגול."
      }
    }
  }
};

export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', direction: 'rtl' }
];

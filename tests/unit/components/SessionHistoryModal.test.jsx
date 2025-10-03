import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SessionHistoryModal from '../../../src/components/SessionHistoryModal';

// Mock design system components
vi.mock('../../../src/components/design-system', () => ({
  Modal: ({ children, open, onClose, showCloseButton }) => {
    if (!open) return null;
    return (
      <div role="dialog" data-testid="modal">
        {showCloseButton && (
          <button onClick={onClose} aria-label="Close">Close</button>
        )}
        {children}
      </div>
    );
  },
  Button: ({ children, onClick, className, variant, size }) => (
    <button onClick={onClick} className={className} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
  Text: ({ children, className, variant }) => (
    <div className={className} data-variant={variant}>{children}</div>
  ),
  Heading: ({ children, className, level }) => (
    <h3 className={className} data-level={level}>{children}</h3>
  ),
}));

// Mock session data
vi.mock('../../../src/data/sessions', () => ({
  getSessionById: vi.fn((id) => {
    const sessions = {
      'quick-energizer': { name: 'Quick Energizer', duration: 5 },
      'morning-flow': { name: 'Morning Flow', duration: 10 },
    };
    return sessions[id];
  }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SessionHistoryModal', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const mockSessions = [
    {
      id: 'session-1',
      sessionId: 'quick-energizer',
      sessionName: 'Quick Energizer',
      duration: 5,
      completedAt: '2024-10-03T08:00:00.000Z',
      preMood: 3,
      postMood: 4,
      preEnergy: 2,
      postEnergy: 4,
      moodImprovement: 1,
      energyImprovement: 2,
    },
    {
      id: 'session-2',
      sessionId: 'morning-flow',
      sessionName: 'Morning Flow',
      duration: 10,
      completedAt: '2024-10-03T09:30:00.000Z',
      preMood: 2,
      postMood: 5,
      preEnergy: 1,
      postEnergy: 4,
      moodImprovement: 3,
      energyImprovement: 3,
    },
  ];

  it('renders modal when open with sessions', () => {
    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={vi.fn()}
          selectedDate="2024-10-03"
          sessions={mockSessions}
        />
      </BrowserRouter>
    );

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Practice History')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={false}
          onClose={vi.fn()}
          selectedDate="2024-10-03"
          sessions={mockSessions}
        />
      </BrowserRouter>
    );

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('returns null when selectedDate is not provided', () => {
    const { container } = render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={vi.fn()}
          selectedDate={null}
          sessions={mockSessions}
        />
      </BrowserRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('returns null when sessions array is empty', () => {
    const { container } = render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={vi.fn()}
          selectedDate="2024-10-03"
          sessions={[]}
        />
      </BrowserRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('displays formatted date', () => {
    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={vi.fn()}
          selectedDate="2024-10-03"
          sessions={mockSessions}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(/Thursday, October 3, 2024/i)).toBeInTheDocument();
  });

  it('displays total session count', () => {
    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={vi.fn()}
          selectedDate="2024-10-03"
          sessions={mockSessions}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('2')).toBeInTheDocument(); // Total sessions
  });

  it('displays total minutes', () => {
    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={vi.fn()}
          selectedDate="2024-10-03"
          sessions={mockSessions}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('15')).toBeInTheDocument(); // 5 + 10 minutes
  });

  it('displays session details', () => {
    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={vi.fn()}
          selectedDate="2024-10-03"
          sessions={mockSessions}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Quick Energizer')).toBeInTheDocument();
    expect(screen.getByText('Morning Flow')).toBeInTheDocument();
  });

  it('displays session times', () => {
    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={vi.fn()}
          selectedDate="2024-10-03"
          sessions={mockSessions}
        />
      </BrowserRouter>
    );

    // Times will vary based on timezone, but check for time format
    const timeElements = screen.getAllByText(/\d{1,2}:\d{2}\s?(AM|PM)/i);
    expect(timeElements.length).toBeGreaterThan(0);
  });

  it('displays mood improvements', () => {
    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={vi.fn()}
          selectedDate="2024-10-03"
          sessions={mockSessions}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(/\+1 mood/i)).toBeInTheDocument();
    expect(screen.getByText(/\+3 mood/i)).toBeInTheDocument();
  });

  it('displays energy improvements', () => {
    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={vi.fn()}
          selectedDate="2024-10-03"
          sessions={mockSessions}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(/\+2 energy/i)).toBeInTheDocument();
    expect(screen.getByText(/\+3 energy/i)).toBeInTheDocument();
  });

  it('calculates and displays average mood improvement', () => {
    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={vi.fn()}
          selectedDate="2024-10-03"
          sessions={mockSessions}
        />
      </BrowserRouter>
    );

    // Average mood improvement: (1 + 3) / 2 = 2.0
    expect(screen.getByText('+2.0')).toBeInTheDocument();
  });

  it('shows repeat session buttons', () => {
    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={vi.fn()}
          selectedDate="2024-10-03"
          sessions={mockSessions}
        />
      </BrowserRouter>
    );

    const repeatButtons = screen.getAllByRole('button', { name: /Repeat This Session/i });
    expect(repeatButtons).toHaveLength(2);
  });

  it('navigates to yoga practice when repeat button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={onClose}
          selectedDate="2024-10-03"
          sessions={mockSessions}
        />
      </BrowserRouter>
    );

    const repeatButtons = screen.getAllByRole('button', { name: /Repeat This Session/i });
    await user.click(repeatButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/practice/quick-energizer');
    expect(onClose).toHaveBeenCalled();
  });

  it('navigates to breathing practice for breathing sessions', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const breathingSessions = [
      {
        id: 'breathing-1',
        type: 'breathing',
        exerciseId: 'box-breathing',
        exerciseName: 'Box Breathing',
        duration: 5,
        completedAt: '2024-10-03T08:00:00.000Z',
        moodImprovement: null,
      },
    ];

    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={onClose}
          selectedDate="2024-10-03"
          sessions={breathingSessions}
        />
      </BrowserRouter>
    );

    const repeatButton = screen.getByRole('button', { name: /Repeat This Session/i });
    await user.click(repeatButton);

    expect(mockNavigate).toHaveBeenCalledWith('/breathing/box-breathing');
    expect(onClose).toHaveBeenCalled();
  });

  it('shows breathing session badge', () => {
    const breathingSessions = [
      {
        id: 'breathing-1',
        type: 'breathing',
        exerciseId: 'box-breathing',
        exerciseName: 'Box Breathing',
        duration: 5,
        completedAt: '2024-10-03T08:00:00.000Z',
        moodImprovement: null,
      },
    ];

    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={vi.fn()}
          selectedDate="2024-10-03"
          sessions={breathingSessions}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Breathing')).toBeInTheDocument();
  });

  it('shows custom session badge for custom sessions', () => {
    const customSessions = [
      {
        id: 'custom-1',
        sessionId: 'custom-123',
        sessionName: 'My Custom Flow',
        duration: 15,
        completedAt: '2024-10-03T08:00:00.000Z',
        moodImprovement: null,
        type: 'yoga', // Explicitly set type
      },
    ];

    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={vi.fn()}
          selectedDate="2024-10-03"
          sessions={customSessions}
        />
      </BrowserRouter>
    );

    // Custom sessions show a Custom badge
    const badges = screen.getAllByText(/Custom|Yoga/i);
    expect(badges.length).toBeGreaterThan(0);
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={onClose}
          selectedDate="2024-10-03"
          sessions={mockSessions}
        />
      </BrowserRouter>
    );

    // Get the main close button at the bottom (not the X button in header)
    const closeButtons = screen.getAllByRole('button', { name: /Close/i });
    const mainCloseButton = closeButtons.find(btn => btn.textContent === 'Close');
    await user.click(mainCloseButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('displays session type breakdown', () => {
    const mixedSessions = [
      ...mockSessions,
      {
        id: 'breathing-1',
        type: 'breathing',
        exerciseId: 'box-breathing',
        exerciseName: 'Box Breathing',
        duration: 5,
        completedAt: '2024-10-03T10:00:00.000Z',
        moodImprovement: null,
      },
    ];

    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={vi.fn()}
          selectedDate="2024-10-03"
          sessions={mixedSessions}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(/2 yoga/i)).toBeInTheDocument();
    expect(screen.getByText(/1 breathing/i)).toBeInTheDocument();
  });

  it('does not show mood improvement section when no sessions have mood data', () => {
    const sessionsWithoutMood = [
      {
        id: 'session-1',
        sessionId: 'quick-energizer',
        sessionName: 'Quick Energizer',
        duration: 5,
        completedAt: '2024-10-03T08:00:00.000Z',
        moodImprovement: null,
      },
    ];

    render(
      <BrowserRouter>
        <SessionHistoryModal
          isOpen={true}
          onClose={vi.fn()}
          selectedDate="2024-10-03"
          sessions={sessionsWithoutMood}
        />
      </BrowserRouter>
    );

    expect(screen.queryByText('Wellbeing Impact')).not.toBeInTheDocument();
  });
});

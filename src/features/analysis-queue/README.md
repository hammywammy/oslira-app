# Analysis Queue Indicator

Real-time analysis progress tracking widget for the topbar. Displays active/recent analyses with beautiful animations and live progress updates via adaptive polling.

## Features

### 🎯 Smart Display Logic
- **Single job**: Shows `[avatar] @username 45% • 2/4 ▾`
- **Multiple jobs**: Shows `[stacked avatars] 3 analyzing ▾`
- **Auto-hide**: Hides when queue is empty
- **Auto-show**: Appears when first job starts

### ✨ Visual Polish
- **24px circular avatars** with Instagram profile pic or first-letter fallback
- **60px slim progress bar** with `--primary` color fill
- **Shimmer animation** on active progress bars
- **Pulse glow** on pill when new job starts
- **Status indicators**: Checkmark (success), X (failed), spinner (analyzing)

### 🔄 Real-time Updates
- **Adaptive polling** via React Query (2s when active, 10s when idle)
- **Automatic deduplication** and cache management
- **Zustand state management** for reactive UI

### ♿ Accessibility
- **Keyboard navigation** with Tab through items
- **Escape to close** dropdown
- **Outside click** detection
- **Screen reader friendly** with proper ARIA labels

### 🎭 Interaction
- **Framer Motion animations** for smooth transitions
- **Auto-dismiss** completed items after 3 seconds
- **Retry button** for failed items (on hover)
- **Scrollable dropdown** (max-height 320px)

## File Architecture

```
src/features/analysis-queue/
├── components/
│   ├── QueueIndicator.tsx    # Main pill button (topbar widget)
│   ├── QueueDropdown.tsx      # Dropdown panel with job list
│   └── QueueItem.tsx          # Individual job row
├── stores/
│   └── useAnalysisQueueStore.ts  # Zustand state management
├── hooks/
│   └── useActiveAnalyses.ts   # React Query polling hook
├── utils/
│   └── demoQueue.ts           # Demo/testing utility
├── index.ts                   # Public exports
└── README.md                  # This file
```

## Usage

### Integration (Already Done)

The queue indicator is integrated into the TopBar component:

```tsx
import { QueueIndicator, useActiveAnalyses } from '@/features/analysis-queue';

export function TopBar() {
  // Initialize polling for active analyses
  useActiveAnalyses();

  return (
    <header>
      {/* ... other topbar elements ... */}
      <QueueIndicator />
    </header>
  );
}
```

### Demo Mode

For testing without backend:

```javascript
// In browser console:
window.startDemoQueue();  // Start simulated analyses
window.stopDemoQueue();   // Stop and clear
```

### Backend API Endpoint

The hook polls this endpoint:

```
GET /api/analysis-queue/active
```

**Response format:**

```json
{
  "success": true,
  "data": [
    {
      "leadId": "unique-lead-id",
      "username": "johndoe",
      "avatarUrl": "https://instagram.com/avatar.jpg",
      "progress": 45,
      "step": {
        "current": 2,
        "total": 4
      },
      "status": "analyzing",
      "startedAt": 1234567890
    }
  ]
}
```

**Polling behavior:**
- Polls every 2 seconds when analyses are active
- Slows to every 10 seconds when queue is empty
- Automatically syncs data into Zustand store

## State Management

The Zustand store tracks:

```typescript
interface AnalysisJob {
  leadId: string;
  username: string;
  avatarUrl?: string;
  progress: number; // 0-100
  step: {
    current: number;
    total: number;
  };
  status: 'pending' | 'analyzing' | 'complete' | 'failed';
  startedAt: number;
  completedAt?: number;
}
```

## Customization

### Progress Bar Color

Edit `QueueItem.tsx`:

```tsx
className={`
  ${status === 'complete' ? 'bg-green-500' :
    status === 'failed' ? 'bg-red-500' :
    'bg-primary'}  // Change 'bg-primary' to your color
`}
```

### Auto-dismiss Delay

Edit `useAnalysisQueueStore.ts`:

```typescript
setTimeout(() => {
  get().removeJob(leadId);
}, 3000);  // Change 3000 to your delay (ms)
```

### Max Dropdown Height

Edit `QueueDropdown.tsx`:

```tsx
className="max-h-[320px] ..."  // Change 320px to your height
```

## Development

```bash
# Start dev server
npm run dev

# In browser console, start demo
window.startDemoQueue()
```

## Production Deployment

1. Ensure backend implements `/api/analysis-queue/active` endpoint
2. Backend should return all active analyses for the authenticated user
3. Test with real Durable Objects connection
4. Monitor polling performance in production

## Credits

Built with:
- **React Query** - Data fetching and polling
- **Zustand** - State management
- **Framer Motion** - Animations
- **Iconify** - Icons
- **Tailwind CSS** - Styling

---

Made with ❤️ for impressive real-time UX

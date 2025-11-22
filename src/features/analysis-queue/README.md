# Analysis Queue Indicator

Real-time analysis progress tracking widget for the topbar. Displays active/recent analyses with beautiful animations and live progress updates via Server-Sent Events (SSE).

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
- **SSE connection** to Durable Objects backend
- **Auto-reconnect** with exponential backoff
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
│   └── useQueueSSE.ts         # SSE connection hook
├── utils/
│   └── demoQueue.ts           # Demo/testing utility
├── index.ts                   # Public exports
└── README.md                  # This file
```

## Usage

### Integration (Already Done)

The queue indicator is integrated into the TopBar component:

```tsx
import { QueueIndicator, useQueueSSE } from '@/features/analysis-queue';

export function TopBar() {
  // Initialize SSE connection
  useQueueSSE();

  return (
    <header>
      {/* ... other topbar elements ... */}
      <QueueIndicator />
    </header>
  );
}
```

### Demo Mode

For testing without backend SSE:

```javascript
// In browser console:
window.startDemoQueue();  // Start simulated analyses
window.stopDemoQueue();   // Stop and clear
```

### Backend SSE Endpoint

Update the SSE endpoint in `hooks/useQueueSSE.ts`:

```typescript
const SSE_ENDPOINT = '/api/analysis-queue/stream';
```

### SSE Message Format

```json
{
  "type": "start" | "progress" | "complete" | "failed",
  "leadId": "unique-lead-id",
  "username": "johndoe",
  "avatarUrl": "https://instagram.com/avatar.jpg",
  "progress": 45,
  "step": {
    "current": 2,
    "total": 4
  }
}
```

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

1. Configure SSE endpoint in `hooks/useQueueSSE.ts`
2. Ensure backend sends messages in correct format
3. Test with real Durable Objects connection
4. Monitor reconnection behavior in production

## Credits

Built with:
- **Zustand** - State management
- **Framer Motion** - Animations
- **Iconify** - Icons
- **Tailwind CSS** - Styling

---

Made with ❤️ for impressive real-time UX

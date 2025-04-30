export default function FindFplId() {
    return (
      <div className="min-h-screen bg-soft-teal flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-forest-green mb-4">How to Find Your FPL Manager ID</h1>
        <div className="max-w-md bg-light-gray p-6 rounded-lg shadow-md text-forest-green">
          <p className="mb-4">
            Your FPL Manager ID is a unique number assigned to your Fantasy Premier League team. Follow these steps to find it:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Log in to your account on the{" "}
              <a
                href="https://fantasy.premierleague.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vibrant-magenta hover:underline"
              >
                official Fantasy Premier League website
              </a>.
            </li>
            <li>Click on the <strong>Points</strong> tab at the top of the page.</li>
            <li>
              Look at the URL in your browser’s address bar. It will look like{" "}
              <code>https://fantasy.premierleague.com/entry/YOUR_ID/event/...</code>.
            </li>
            <li>
              The number between <code>entry/</code> and <code>/event</code> is your Manager ID (e.g., 123456).
            </li>
          </ol>
          <p className="mt-4">
            <link href="/" className="text-vibrant-magenta hover:underline">
              Back to Sign-Up
            </link>
          </p>
        </div>
      </div>
    );
  }
'use client';

export default function UnconfiguredApp() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-2xl rounded-lg border border-destructive bg-card p-8 text-center text-card-foreground shadow-2xl shadow-primary/10">
                <h1 className="font-headline text-3xl text-destructive">Firebase Not Configured</h1>
                <p className="mt-4 text-muted-foreground">
                    Your application is missing the necessary Firebase configuration.
                </p>
                <p className="mt-2 text-muted-foreground">
                    Please copy the following into a <code>.env</code> file in the root of your project and fill in the values from your Firebase project settings.
                </p>
                <div className="mt-6 w-full overflow-x-auto rounded-md bg-muted p-4 text-left">
                    <pre className="text-sm text-muted-foreground">
                        <code>
                            NEXT_PUBLIC_FIREBASE_API_KEY=...<br/>
                            NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...<br/>
                            NEXT_PUBLIC_FIREBASE_PROJECT_ID=...<br/>
                            NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...<br/>
                            NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...<br/>
                            NEXT_PUBLIC_FIREBASE_APP_ID=...
                        </code>
                    </pre>
                </div>
                 <p className="mt-6 text-xs text-muted-foreground">
                    After creating the <code>.env</code> file, you may need to restart the development server for the changes to take effect.
                </p>
            </div>
        </div>
    );
}

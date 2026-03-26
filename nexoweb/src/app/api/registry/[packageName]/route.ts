import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Dynamic route: GET /api/registry/[packageName]
// Returns the raw N# source code for a specific package so the CLI can install it.
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ packageName: string }> }
) {
    const { packageName } = await params;
    const registryPath = path.join(process.cwd(), 'public', 'registry.json');

    try {
        const db = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
        const entry = db[packageName];

        if (!entry) {
            return NextResponse.json(
                { error: `Package '${packageName}' not found.` },
                { status: 404 }
            );
        }

        // Return raw .nexo source code as plain text so the CLI can write it to disk directly
        return new NextResponse(entry.code, {
            status: 200,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    } catch {
        return NextResponse.json({ error: 'Registry offline.' }, { status: 500 });
    }
}

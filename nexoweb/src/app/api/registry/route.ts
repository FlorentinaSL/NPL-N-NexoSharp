import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    // Exposes the array of available global package keys to the Next.js Frontend
    const registryPath = path.join(process.cwd(), 'registry.json');
    try {
        const fileContent = fs.readFileSync(registryPath, 'utf-8');
        const db = JSON.parse(fileContent);
        return NextResponse.json(Object.keys(db.packages || {}));
    } catch(e) {
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const masterKey = process.env.NEXO_API_KEY || "NexoAura2026-V1";
    
        if (!authHeader || authHeader !== `Bearer ${masterKey}`) {
          return NextResponse.json({ error: "NXC009: Cryptographic Handshake Failed. Invalid or missing V1 API Key." }, { status: 401 });
        }

        const { name, code } = await request.json();
        
        if (!name || !code || typeof name !== 'string' || typeof code !== 'string') {
            return NextResponse.json({ error: "[NXC-500] Critical validation exception: Missing structural identifier or code payload." }, { status: 400 });
        }
        
        if (name.includes(' ') || name.length < 3) {
            return NextResponse.json({ error: "[NXC-501] Critical syntax exception: Invalid or unresolvable package naming format." }, { status: 400 });
        }

        const registryPath = path.join(process.cwd(), 'registry.json');
        let db = { packages: {} as Record<string, string> };
        
        if (fs.existsSync(registryPath)) {
            db = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
        }
        
        // Permanently bind user code to the global database layer
        db.packages[name] = code;
        fs.writeFileSync(registryPath, JSON.stringify(db, null, 2), 'utf-8');
        
        return NextResponse.json({ success: true, message: `Package '${name}' synchronized successfully with the Global NPM Array.` });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

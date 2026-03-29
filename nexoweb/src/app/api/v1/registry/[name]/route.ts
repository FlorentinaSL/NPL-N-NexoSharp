import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string[] }> }
) {
    const resolvedParams = await params;
    const packageName = resolvedParams.name ? resolvedParams.name.join('.') : '';
    const registryPath = path.join(process.cwd(), 'public', 'registry.json');
    
    try {
        if (!fs.existsSync(registryPath)) {
            return new Response("NXC-404: Global Library Database Missing", { status: 404 });
        }
        
        const fileContent = fs.readFileSync(registryPath, 'utf-8');
        const db = JSON.parse(fileContent);
        
        const pkg = db[packageName];
        
        if (!pkg || !pkg.code) {
            return new Response(`NXC-404: Package '${packageName}' not found in Global Index`, { status: 404 });
        }
        
        // Return raw source code as plain text for the C# Interpreter/Compiler
        return new Response(pkg.code, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    } catch (e: any) {
        return new Response(`NXC-500: Internal Hub Error - ${e.message}`, { status: 500 });
    }
}

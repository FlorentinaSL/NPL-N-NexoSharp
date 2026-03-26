import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request, { params }: { params: Promise<{ package: string }> }) {
    const pkgName = (await params).package;
    const registryPath = path.join(process.cwd(), 'registry.json');
    
    try {
        const fileContent = fs.readFileSync(registryPath, 'utf-8');
        const db = JSON.parse(fileContent);
        
        if (db.packages && db.packages[pkgName]) {
            return new NextResponse(db.packages[pkgName], {
                status: 200,
                headers: { 
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
    } catch(e) { }

    return new NextResponse("[NXC-404] NPM Server Fault: Package '" + pkgName + "' could not be found globally in the cloud registry.", { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
    });
}

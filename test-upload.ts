import { createSession } from './src/lib/auth';
import { Role } from '@prisma/client';
import { prisma } from './src/lib/prisma';
import fs from 'fs';

async function testUpload() {
  const user = await prisma.user.findFirst({ where: { role: 'site_supervisor' }});
  if (!user) {
    console.log("No user found");
    return;
  }
  
  const project = await prisma.project.findFirst();
  if (!project) return;
  
  const issue = await prisma.issue.create({
    data: {
      projectId: project.id,
      title: "Test Issue",
      description: "Test Desc",
      priority: "low",
      createdBy: user.id
    }
  });

  console.log("Created issue", issue.id);

  // We need to simulate the API call. Since it's a route handler, we can just call the POST function directly
  // But Next.js route handlers expect a Web Request.
  // Instead, let's call uploadFile directly.
  const { uploadFile } = require('./src/lib/storage');
  
  // Create a dummy image file (1x1 transparent PNG)
  const pngBytes = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d4944415478da6360000000020001e226059b0000000049454e44ae426082', 'hex');
  
  const file = new File([pngBytes], "test.png", { type: "image/png" });
  
  try {
    const url = await uploadFile(file);
    console.log("Upload URL:", url);
    
    const att = await prisma.attachment.create({
      data: {
        entityType: 'issue',
        entityId: issue.id,
        fileUrl: url,
        fileName: file.name,
        fileSizeBytes: file.size,
        mimeType: file.type,
        uploadedBy: user.id,
      }
    });
    console.log("Attachment created:", att);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testUpload();

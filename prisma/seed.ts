import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── Helpers ───────────────────────────────────────────────

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function dateString(daysBack: number): string {
  const d = daysAgo(daysBack);
  return d.toISOString().split('T')[0];
}

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

// ─── Image URLs ────────────────────────────────────────────

const PROFILE_IMGS = [
  'https://i.pravatar.cc/150?img=11',
  'https://i.pravatar.cc/150?img=12',
  'https://i.pravatar.cc/150?img=32',
];

const CONSTRUCTION_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1541888946425-d81bb56ed23c?w=400', name: 'construction-site.jpg', mime: 'image/jpeg' },
  { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400', name: 'high-rise.jpg', mime: 'image/jpeg' },
  { url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400', name: 'modern-building.jpg', mime: 'image/jpeg' },
  { url: 'https://images.unsplash.com/photo-1511818966892-d7d48dc19e3b?w=400', name: 'blueprints.jpg', mime: 'image/jpeg' },
  { url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400', name: 'worker.jpg', mime: 'image/jpeg' },
  { url: 'https://images.unsplash.com/photo-1582407947304-f4354e8c69b2?w=400', name: 'materials-yard.jpg', mime: 'image/jpeg' },
  { url: 'https://images.unsplash.com/photo-1531834685032-ef8227e0e80e?w=400', name: 'crane.jpg', mime: 'image/jpeg' },
  { url: 'https://images.unsplash.com/photo-1578996952320-0f2b7431e98e?w=400', name: 'dubai-skyline.jpg', mime: 'image/jpeg' },
];

function pickPhoto(index: number) {
  return CONSTRUCTION_PHOTOS[index % CONSTRUCTION_PHOTOS.length];
}

// ─── Data ──────────────────────────────────────────────────

const PROJECTS_DATA = [
  {
    name: 'Downtown Dubai Tower',
    code: 'DDT-2026',
    location: 'Downtown Dubai, UAE',
    description: '68-storey mixed-use residential and commercial tower adjacent to Burj Khalifa. Includes retail podium, sky garden, and 3-level basement parking.',
  },
  {
    name: 'Marina Bay Residences',
    code: 'MBR-2026',
    location: 'Dubai Marina, UAE',
    description: 'Twin 42-storey luxury residential towers with waterfront views, infinity pool, and private beach access. 320 units across 2 towers.',
  },
  {
    name: 'Business Bay Office Park',
    code: 'BBOP-2026',
    location: 'Business Bay, Dubai, UAE',
    description: 'Grade-A commercial office complex with 3 interconnected towers, 50,000 sqm of leasable space, and a central retail courtyard.',
  },
  {
    name: 'Palm Jumeirah Villas',
    code: 'PJV-2026',
    location: 'Palm Jumeirah, Dubai, UAE',
    description: 'Exclusive beachfront villa development featuring 12 custom-designed luxury villas with private pools, landscaped gardens, and direct beach access.',
  },
];

const SUPERVISOR_TASKS = [
  // Supervisor 1 — assigned to all 4 projects
  {
    projectIdx: 0,
    issues: [
      { title: 'Steel reinforcement delay on level 12', description: 'The delivery of rebar for the level 12 columns has been delayed by 3 days. Affecting the pour schedule.', priority: 'high', status: 'open', daysBack: 2 },
      { title: 'Crane hydraulic leak reported', description: 'Tower crane #2 has a slow hydraulic fluid leak. Maintenance team notified. Operations halted until inspection.', priority: 'critical', status: 'in_progress', daysBack: 5 },
      { title: 'Concrete strength test failed', description: 'Core sample from last week\'s pour on level 10 failed the 7-day strength test. Recommend structural review before proceeding.', priority: 'critical', status: 'resolved', daysBack: 14 },
    ],
    requests: [
      { material: 'Cement (Portland Grade 42.5)', quantity: '500 bags', urgency: 'high', status: 'approved', daysBack: 10 },
      { material: 'Steel Rebar 16mm', quantity: '200 tonnes', urgency: 'critical', status: 'fulfilled', daysBack: 20 },
      { material: 'Glass Panels (6mm tempered)', quantity: '80 panels', urgency: 'medium', status: 'pending', daysBack: 3 },
    ],
    reports: [
      { completed: 'Completed formwork stripping on levels 8-10. Installed rebar cages for columns on level 11.', progress: 35, delays: 'Concrete pump breakdown caused 2-hour delay in the morning pour.', weather: 'Sunny, 38°C', daysBack: 1 },
      { completed: 'Finished concrete pour for level 11 deck slab. Quality control inspection passed. Started block work on level 7.', progress: 38, delays: null, weather: 'Sunny, 36°C', daysBack: 3 },
      { completed: 'MEP rough-in on levels 5-6. Electrical conduits and plumbing risers installed. Scaffolding inspection completed.', progress: 42, delays: 'Steel delivery delay — waiting for rebar to continue columns on level 12.', weather: 'Partly cloudy, 35°C', daysBack: 6 },
    ],
  },
  {
    projectIdx: 1,
    issues: [
      { title: 'Waterproofing issue in basement B2', description: 'Water seepage detected along the north retaining wall of basement level 2. Requires immediate waterproofing remediation.', priority: 'critical', status: 'open', daysBack: 1 },
      { title: 'Window installation misalignment Tower B', description: 'Floor-to-ceiling windows on floors 15-18 of Tower B are installed 15mm off the specified alignment. Contractor to reinstall.', priority: 'high', status: 'open', daysBack: 4 },
    ],
    requests: [
      { material: 'Marble Tiles (Italian, 60x60cm)', quantity: '1,200 sqm', urgency: 'medium', status: 'pending', daysBack: 2 },
      { material: 'HVAC Ducting Kit', quantity: '25 units', urgency: 'high', status: 'approved', daysBack: 8 },
    ],
    reports: [
      { completed: 'Tiling work commenced on Tower A lobby area. Completed 40% of floor tiling. Window installation ongoing on Tower A floors 12-14.', progress: 55, delays: null, weather: 'Sunny, 34°C', daysBack: 1 },
      { completed: 'Plumbing pressure test for Tower A completed — all passed. Started electrical rough-in for Tower B levels 5-8.', progress: 52, delays: 'Window misalignment on Tower B causing delay. Contractor reworking.', weather: 'Sunny, 37°C', daysBack: 4 },
    ],
  },
  {
    projectIdx: 2,
    issues: [
      { title: 'Fire alarm system integration failed', description: 'The fire alarm panel integration with the BMS system is showing communication errors. Siemens technician scheduled for tomorrow.', priority: 'high', status: 'open', daysBack: 3 },
      { title: 'Elevator shaft dimensions off by 5cm', description: 'Elevator shaft B in the west tower is 5cm narrower than specified. Structural modifications needed before cab installation.', priority: 'medium', status: 'in_progress', daysBack: 7 },
      { title: 'Roof waterproofing completed — inspection passed', description: 'The roof membrane installation for Tower 1 has been completed and passed the water test inspection.', priority: 'low', status: 'resolved', daysBack: 12 },
    ],
    requests: [
      { material: 'Gypsum Board (12mm)', quantity: '3,000 sheets', urgency: 'high', status: 'approved', daysBack: 5 },
      { material: 'Paint — Interior Emulsion (White)', quantity: '400 gallons', urgency: 'medium', status: 'pending', daysBack: 1 },
    ],
    reports: [
      { completed: 'Drywall installation on levels 3-5 of the west tower. MEP rough-in inspection for east tower levels 1-2 passed.', progress: 28, delays: 'Fire alarm integration issue pending resolution.', weather: 'Sunny, 35°C', daysBack: 1 },
      { completed: 'Concrete pour for east tower level 3 slab completed. Started column formwork for level 4.', progress: 25, delays: null, weather: 'Sunny, 36°C', daysBack: 5 },
      { completed: 'Site preparation for the central courtyard commenced. Excavation for landscaping features started.', progress: 22, delays: null, weather: 'Clear, 34°C', daysBack: 8 },
    ],
  },
  {
    projectIdx: 3,
    issues: [
      { title: 'Landscaping irrigation design conflict', description: 'The irrigation pipe routing conflicts with the underground electrical conduits for Villa 3. Need redesigned layout.', priority: 'medium', status: 'open', daysBack: 2 },
      { title: 'Swimming pool tiling defect Villa 5', description: 'Tiles on the infinity edge of Villa 5 pool are showing hairline cracks. Supplier to replace defective batch.', priority: 'high', status: 'in_progress', daysBack: 6 },
    ],
    requests: [
      { material: 'Landscaping Palm Trees', quantity: '24 trees', urgency: 'medium', status: 'pending', daysBack: 4 },
      { material: 'Pool Filtration System', quantity: '6 units', urgency: 'high', status: 'approved', daysBack: 9 },
      { material: 'Outdoor Lighting Fixtures', quantity: '48 units', urgency: 'low', status: 'fulfilled', daysBack: 18 },
    ],
    reports: [
      { completed: 'Villa 1 & 2 — roofing structure completed. Villa 3 — foundation pour completed. Landscaping earthworks started at the north end.', progress: 45, delays: null, weather: 'Sunny, 33°C', daysBack: 2 },
      { completed: 'Villa 4 & 5 — block work 60% complete. Villa 6 — slab on grade poured. Pool excavation for Villa 1 & 2 started.', progress: 42, delays: 'Swimming pool tiles — waiting for replacement batch from supplier.', weather: 'Sunny, 35°C', daysBack: 5 },
      { completed: 'Infrastructure works — main drainage and water supply lines laid for Villas 1-6. Electrical duct bank installation ongoing.', progress: 38, delays: null, weather: 'Clear, 36°C', daysBack: 9 },
    ],
  },
];

// Supervisor 2 — assigned to projects 0 and 2 only
const SUPERVISOR2_TASKS = [
  {
    projectIdx: 0,
    issues: [
      { title: 'Safety violation — harness not used', description: 'Worker observed on scaffolding at level 9 without proper safety harness. Site safety officer issued warning. Mandatory retraining scheduled.', priority: 'high', status: 'resolved', daysBack: 8 },
      { title: 'Material wastage on site', description: 'Excessive offcuts of plywood found in debris. Recommend better cutting planning and material tracking.', priority: 'low', status: 'open', daysBack: 3 },
    ],
    requests: [
      { material: 'Safety Harness Kits', quantity: '30 units', urgency: 'high', status: 'fulfilled', daysBack: 15 },
    ],
    reports: [
      { completed: 'Safety toolbox talk conducted for all crews. Inspected scaffolding on levels 5-9 — all compliant. Continued rebar installation on level 12.', progress: 36, delays: null, weather: 'Sunny, 37°C', daysBack: 2 },
    ],
  },
  {
    projectIdx: 2,
    issues: [
      { title: 'Site access road damaged', description: 'Heavy truck traffic has damaged the temporary site access road near the east entrance. Needs grading and gravel refill before next delivery.', priority: 'medium', status: 'in_progress', daysBack: 4 },
    ],
    requests: [
      { material: 'Temporary Fencing Panels', quantity: '50 panels', urgency: 'medium', status: 'approved', daysBack: 6 },
      { material: 'Safety Cones & Barriers', quantity: '100 units', urgency: 'low', status: 'fulfilled', daysBack: 14 },
    ],
    reports: [
      { completed: 'East tower — completed MEP rough-in on level 1. West tower — drywall installation continued on levels 4-6. Access road maintenance scheduled.', progress: 27, delays: 'Site access road needs repair before next steel delivery.', weather: 'Sunny, 34°C', daysBack: 3 },
      { completed: 'Weekly safety inspection completed. All crane certifications verified. Fire extinguishers checked and logged.', progress: 24, delays: null, weather: 'Partly cloudy, 35°C', daysBack: 7 },
    ],
  },
];

// ─── Main Seed ─────────────────────────────────────────────

async function main() {
  console.log('🧹 Clearing existing data...');
  await prisma.notification.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.materialRequest.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.dailyReport.deleteMany();
  await prisma.projectMembership.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Database cleared.');

  // ── Create Users ───────────────────────────────────────

  const pmPassword = await hashPassword('admin123');
  const sup1Password = await hashPassword('super1');
  const sup2Password = await hashPassword('super2');

  const pm = await prisma.user.create({
    data: {
      fullName: 'Ahmed Al Maktoum',
      email: 'ahmed@sitelog.demo',
      passwordHash: pmPassword,
      role: 'project_manager',
      profileImageUrl: PROFILE_IMGS[0],
      onboardedAt: daysAgo(30),
    },
  });

  const sup1 = await prisma.user.create({
    data: {
      fullName: 'Raj Kapoor',
      email: 'raj@sitelog.demo',
      passwordHash: sup1Password,
      role: 'site_supervisor',
      profileImageUrl: PROFILE_IMGS[1],
      onboardedAt: daysAgo(28),
    },
  });

  const sup2 = await prisma.user.create({
    data: {
      fullName: 'Carlos Mendez',
      email: 'carlos@sitelog.demo',
      passwordHash: sup2Password,
      role: 'site_supervisor',
      profileImageUrl: PROFILE_IMGS[2],
      onboardedAt: daysAgo(25),
    },
  });

  console.log('✅ Users created:');
  console.log('   PM:          ahmed@sitelog.demo / admin123');
  console.log('   Supervisor:  raj@sitelog.demo / super1');
  console.log('   Supervisor:  carlos@sitelog.demo / super2');

  // ── Create Projects ────────────────────────────────────

  const projects: { id: string; name: string }[] = [];

  for (const p of PROJECTS_DATA) {
    const project = await prisma.project.create({
      data: {
        projectName: p.name,
        projectCode: p.code,
        description: p.description,
        location: p.location,
        status: 'active',
        startDate: new Date('2026-01-15'),
        expectedEndDate: new Date('2027-06-30'),
        assignedProjectManager: pm.id,
        createdBy: pm.id,
      },
    });
    projects.push({ id: project.id, name: p.name });
  }

  console.log('✅ 4 projects created.');

  // ── Assign Memberships ─────────────────────────────────

  // Supervisor 1 → all 4 projects
  for (const p of projects) {
    await prisma.projectMembership.create({
      data: { projectId: p.id, userId: sup1.id, roleInProject: 'site_supervisor' },
    });
  }

  // Supervisor 2 → project 0 (DDT) and project 2 (BBOP)
  await prisma.projectMembership.create({
    data: { projectId: projects[0].id, userId: sup2.id, roleInProject: 'site_supervisor' },
  });
  await prisma.projectMembership.create({
    data: { projectId: projects[2].id, userId: sup2.id, roleInProject: 'site_supervisor' },
  });

  console.log('✅ Memberships assigned.');

  // ── Issues, Requests, Reports (Supervisor 1) ──────────

  let photoIdx = 0;
  let notifIdx = 0;

  for (const task of SUPERVISOR_TASKS) {
    const projectId = projects[task.projectIdx].id;

    // Issues
    for (const iss of task.issues) {
      const issue = await prisma.issue.create({
        data: {
          projectId,
          title: iss.title,
          description: iss.description,
          priority: iss.priority as any,
          status: iss.status as any,
          createdBy: sup1.id,
          assignedTo: iss.status !== 'resolved' ? sup1.id : sup2.id,
          createdAt: daysAgo(iss.daysBack),
          updatedAt: daysAgo(iss.daysBack),
          resolvedAt: iss.status === 'resolved' ? daysAgo(iss.daysBack - 2) : null,
        },
      });

      // attach a photo to every other issue
      if (notifIdx % 2 === 0) {
        const photo = pickPhoto(photoIdx++);
        await prisma.attachment.create({
          data: {
            entityType: 'issue',
            entityId: issue.id,
            issueId: issue.id,
            uploadedBy: sup1.id,
            fileUrl: photo.url,
            fileName: photo.name,
            fileSizeBytes: 150000,
            mimeType: photo.mime,
          },
        });
      }

      // notification for the PM
      notifIdx++;
      await prisma.notification.create({
        data: {
          recipientId: pm.id,
          type: 'issue_created',
          message: `${issue.title} — reported on ${projects[task.projectIdx].name}`,
          relatedEntityId: issue.id,
          relatedEntityType: 'issue',
          createdAt: daysAgo(iss.daysBack),
        },
      });
    }

    // Material Requests
    for (const req of task.requests) {
      const materialReq = await prisma.materialRequest.create({
        data: {
          projectId,
          requestedBy: sup1.id,
          materialName: req.material,
          quantity: req.quantity,
          urgencyLevel: req.urgency as any,
          status: req.status as any,
          approvedBy: req.status === 'approved' || req.status === 'fulfilled' ? pm.id : null,
          approvedAt: req.status === 'approved' || req.status === 'fulfilled' ? daysAgo(req.daysBack - 1) : null,
          fulfilledAt: req.status === 'fulfilled' ? daysAgo(req.daysBack - 3) : null,
          createdAt: daysAgo(req.daysBack),
        },
      });

      if (req.status !== 'pending') {
        await prisma.notification.create({
          data: {
            recipientId: pm.id,
            type: 'material_request_submitted',
            message: `${req.quantity} of ${req.material} requested for ${projects[task.projectIdx].name}`,
            relatedEntityId: materialReq.id,
            relatedEntityType: 'material_request',
            createdAt: daysAgo(req.daysBack),
          },
        });
      }
    }

    // Daily Reports
    for (const rep of task.reports) {
      const report = await prisma.dailyReport.create({
        data: {
          projectId,
          submittedBy: sup1.id,
          reportDate: daysAgo(rep.daysBack),
          completedWork: rep.completed,
          progressPercentage: rep.progress,
          delays: rep.delays,
          weatherCondition: rep.weather,
          createdAt: daysAgo(rep.daysBack),
        },
      });

      // attach a photo to every other report
      if (notifIdx % 2 === 0) {
        const photo = pickPhoto(photoIdx++);
        await prisma.attachment.create({
          data: {
            entityType: 'daily_report',
            entityId: report.id,
            reportId: report.id,
            uploadedBy: sup1.id,
            fileUrl: photo.url,
            fileName: photo.name,
            fileSizeBytes: 150000,
            mimeType: photo.mime,
          },
        });
      }

      notifIdx++;

      // notification for the PM
      await prisma.notification.create({
        data: {
          recipientId: pm.id,
          type: 'report_submitted',
          message: `Daily report submitted for ${projects[task.projectIdx].name} — ${rep.progress}% complete`,
          relatedEntityId: report.id,
          relatedEntityType: 'daily_report',
          createdAt: daysAgo(rep.daysBack),
        },
      });
    }
  }

  // ── Issues, Requests, Reports (Supervisor 2) ──────────

  for (const task of SUPERVISOR2_TASKS) {
    const projectId = projects[task.projectIdx].id;

    for (const iss of task.issues) {
      const issue = await prisma.issue.create({
        data: {
          projectId,
          title: iss.title,
          description: iss.description,
          priority: iss.priority as any,
          status: iss.status as any,
          createdBy: sup2.id,
          assignedTo: iss.status !== 'resolved' ? sup1.id : sup2.id,
          createdAt: daysAgo(iss.daysBack),
          updatedAt: daysAgo(iss.daysBack),
          resolvedAt: iss.status === 'resolved' ? daysAgo(iss.daysBack - 2) : null,
        },
      });

      if (notifIdx % 2 === 0) {
        const photo = pickPhoto(photoIdx++);
        await prisma.attachment.create({
          data: {
            entityType: 'issue',
            entityId: issue.id,
            issueId: issue.id,
            uploadedBy: sup2.id,
            fileUrl: photo.url,
            fileName: photo.name,
            fileSizeBytes: 150000,
            mimeType: photo.mime,
          },
        });
      }

      notifIdx++;
      await prisma.notification.create({
        data: {
          recipientId: pm.id,
          type: 'issue_created',
          message: `${issue.title} — reported on ${projects[task.projectIdx].name}`,
          relatedEntityId: issue.id,
          relatedEntityType: 'issue',
          createdAt: daysAgo(iss.daysBack),
        },
      });
    }

    for (const req of task.requests) {
      await prisma.materialRequest.create({
        data: {
          projectId,
          requestedBy: sup2.id,
          materialName: req.material,
          quantity: req.quantity,
          urgencyLevel: req.urgency as any,
          status: req.status as any,
          approvedBy: req.status === 'approved' || req.status === 'fulfilled' ? pm.id : null,
          approvedAt: req.status === 'approved' || req.status === 'fulfilled' ? daysAgo(req.daysBack - 1) : null,
          fulfilledAt: req.status === 'fulfilled' ? daysAgo(req.daysBack - 3) : null,
          createdAt: daysAgo(req.daysBack),
        },
      });
    }

    for (const rep of task.reports) {
      const report = await prisma.dailyReport.create({
        data: {
          projectId,
          submittedBy: sup2.id,
          reportDate: daysAgo(rep.daysBack),
          completedWork: rep.completed,
          progressPercentage: rep.progress,
          delays: rep.delays,
          weatherCondition: rep.weather,
          createdAt: daysAgo(rep.daysBack),
        },
      });

      if (notifIdx % 2 === 0) {
        const photo = pickPhoto(photoIdx++);
        await prisma.attachment.create({
          data: {
            entityType: 'daily_report',
            entityId: report.id,
            reportId: report.id,
            uploadedBy: sup2.id,
            fileUrl: photo.url,
            fileName: photo.name,
            fileSizeBytes: 150000,
            mimeType: photo.mime,
          },
        });
      }

      notifIdx++;
      await prisma.notification.create({
        data: {
          recipientId: pm.id,
          type: 'report_submitted',
          message: `Daily report submitted for ${projects[task.projectIdx].name} — ${rep.progress}% complete`,
          relatedEntityId: report.id,
          relatedEntityType: 'daily_report',
          createdAt: daysAgo(rep.daysBack),
        },
      });
    }
  }

  console.log('✅ Issues, requests, reports, and notifications created.');
  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

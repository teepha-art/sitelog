import { prisma } from './prisma';

export interface ActivityItem {
  id: string;
  type: 'report' | 'issue' | 'material_request';
  title: string;
  description: string;
  date: Date;
  projectId: string;
  projectName: string;
  href: string;
}

export async function getRecentActivity(userId: string, projectId?: string): Promise<ActivityItem[]> {
  // We need to fetch recent reports, issues, and approved material requests
  // that belong to the user's scope.
  
  const projectFilter = projectId ? { id: projectId } : {};
  const userScopeFilter = {
    OR: [
      { assignedProjectManager: userId },
      { memberships: { some: { userId: userId } } }
    ]
  };

  const projectWhere = { ...projectFilter, ...userScopeFilter };

  const [reports, issues, requests] = await Promise.all([
    prisma.dailyReport.findMany({
      where: { project: projectWhere },
      include: { project: { select: { projectName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.issue.findMany({
      where: { project: projectWhere },
      include: { project: { select: { projectName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.materialRequest.findMany({
      where: { project: projectWhere, status: 'approved' },
      include: { project: { select: { projectName: true } } },
      orderBy: { updatedAt: 'desc' }, // Use updatedAt because it reflects when it was approved
      take: 5,
    })
  ]);

  const activityItems: ActivityItem[] = [
    ...reports.map(r => ({
      id: r.id,
      type: 'report' as const,
      title: 'Report Submitted',
      description: `Daily report for ${r.reportDate.toLocaleDateString()}`,
      date: r.createdAt,
      projectId: r.projectId,
      projectName: r.project.projectName,
      href: `/reports/${r.id}`
    })),
    ...issues.map(i => ({
      id: i.id,
      type: 'issue' as const,
      title: `Issue ${i.status === 'resolved' ? 'Resolved' : 'Reported'}`,
      description: i.title,
      date: i.status === 'resolved' ? i.updatedAt : i.createdAt,
      projectId: i.projectId,
      projectName: i.project.projectName,
      href: `/issues/${i.id}`
    })),
    ...requests.map(req => ({
      id: req.id,
      type: 'material_request' as const,
      title: 'Request Approved',
      description: `${req.quantity}x ${req.materialName}`,
      date: req.updatedAt,
      projectId: req.projectId,
      projectName: req.project.projectName,
      href: `/materials/${req.id}`
    }))
  ];

  // Sort by date descending and take top 5
  return activityItems
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
}

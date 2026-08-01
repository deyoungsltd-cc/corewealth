import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser, apiResponse, apiError } from '@/lib/api-helpers';

// GET site settings (public - used by landing page and about page)
export async function GET() {
  try {
    let settings = await db.siteSettings.findUnique({ where: { id: 'main' } });
    if (!settings) {
      settings = await db.siteSettings.create({ data: { id: 'main' } });
    }
    return apiResponse({
      aboutPhotoUrl: settings.aboutPhotoUrl,
      aboutPhotoUpdatedAt: settings.aboutPhotoUpdatedAt,
      managementPhotoUrl: settings.managementPhotoUrl,
      managementPhotoUpdatedAt: settings.managementPhotoUpdatedAt,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return apiError('Failed to get settings', 'INTERNAL_ERROR', 500);
  }
}

// POST - Upload photo and store as base64 data URL in database
export async function POST(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return apiError('Authentication required', 'UNAUTHORIZED', 401);
  }
  if (!user.adminRecord) {
    return apiError('Admin access required', 'FORBIDDEN', 403);
  }

  try {
    const formData = await request.formData();
    const file = formData.get('photo') as File | null;
    const target = (formData.get('target') as string) || 'about';

    if (!file) {
      return apiError('No photo file provided', 'MISSING_FILE', 400);
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return apiError('Invalid file type. Use JPG, PNG, WebP, or GIF.', 'INVALID_FILE_TYPE', 400);
    }

    if (file.size > 2 * 1024 * 1024) {
      return apiError('File too large. Maximum 2MB.', 'FILE_TOO_LARGE', 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    let settings = await db.siteSettings.findUnique({ where: { id: 'main' } });
    const updateData: Record<string, any> = {};
    if (target === 'management') {
      updateData.managementPhotoUrl = dataUrl;
      updateData.managementPhotoUpdatedAt = new Date();
    } else {
      updateData.aboutPhotoUrl = dataUrl;
      updateData.aboutPhotoUpdatedAt = new Date();
    }
    if (!settings) {
      settings = await db.siteSettings.create({ data: { id: 'main', ...updateData } });
    } else {
      settings = await db.siteSettings.update({ where: { id: 'main' }, data: updateData });
    }

    return apiResponse({
      aboutPhotoUrl: settings.aboutPhotoUrl,
      aboutPhotoUpdatedAt: settings.aboutPhotoUpdatedAt,
      managementPhotoUrl: settings.managementPhotoUrl,
      managementPhotoUpdatedAt: settings.managementPhotoUpdatedAt,
      message: 'Photo uploaded successfully',
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    return apiError('Failed to upload photo', 'INTERNAL_ERROR', 500);
  }
}

// PUT - Update photo URL (admin only)
export async function PUT(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return apiError('Authentication required', 'UNAUTHORIZED', 401);
  }
  if (!user.adminRecord) {
    return apiError('Admin access required', 'FORBIDDEN', 403);
  }

  try {
    const body = await request.json();
    const { aboutPhotoUrl, managementPhotoUrl } = body;

    const updateData: Record<string, any> = {};
    if (aboutPhotoUrl && typeof aboutPhotoUrl === 'string') {
      updateData.aboutPhotoUrl = aboutPhotoUrl;
      updateData.aboutPhotoUpdatedAt = new Date();
    }
    if (managementPhotoUrl && typeof managementPhotoUrl === 'string') {
      updateData.managementPhotoUrl = managementPhotoUrl;
      updateData.managementPhotoUpdatedAt = new Date();
    }
    if (Object.keys(updateData).length === 0) {
      return apiError('Valid photo URL is required', 'MISSING_URL', 400);
    }

    let settings = await db.siteSettings.findUnique({ where: { id: 'main' } });
    if (!settings) {
      settings = await db.siteSettings.create({ data: { id: 'main', ...updateData } });
    } else {
      settings = await db.siteSettings.update({ where: { id: 'main' }, data: updateData });
    }

    return apiResponse({
      aboutPhotoUrl: settings.aboutPhotoUrl,
      aboutPhotoUpdatedAt: settings.aboutPhotoUpdatedAt,
      managementPhotoUrl: settings.managementPhotoUrl,
      managementPhotoUpdatedAt: settings.managementPhotoUpdatedAt,
      message: 'Photo URL updated successfully',
    });
  } catch (error) {
    console.error('Update photo URL error:', error);
    return apiError('Failed to update photo URL', 'INTERNAL_ERROR', 500);
  }
}

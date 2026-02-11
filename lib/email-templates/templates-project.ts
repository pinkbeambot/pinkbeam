/**
 * Project, File & Meeting Email Templates
 * 
 * Templates for project updates, file sharing, and meeting reminders
 */

import {
  EmailLayout,
  EmailHeader,
  EmailHeaderCompact,
  EmailFooterMinimal,
  EmailButton,
  EmailCard,
  EmailCardList,
  EmailInfoCard,
  EmailCardWithIcon,
  COLORS,
} from './components'

import {
  type ProjectVariables,
  type FileVariables,
  type MeetingVariables,
  getFirstName,
  formatDate,
} from './variables'

// ============================================================================
// Project Templates
// ============================================================================

export function projectStatusUpdateTemplate(data: ProjectVariables): { subject: string; html: string; text: string } {
  const firstName = getFirstName(data.clientName)
  
  const statusInfo: Record<string, { title: string; emoji: string; color: string; message: string }> = {
    'planning': { 
      title: 'Project Planning', 
      emoji: '📋', 
      color: COLORS.info,
      message: "We're in the planning phase of your project. Our team is gathering requirements and preparing the project roadmap."
    },
    'in-progress': { 
      title: 'Project in Progress', 
      emoji: '🚀', 
      color: COLORS.primary,
      message: "Great news! Your project is now in active development. Our team is working hard to bring your vision to life."
    },
    'review': { 
      title: 'Ready for Review', 
      emoji: '👀', 
      color: COLORS.warning,
      message: "Your project is ready for your review! Please take a look and let us know if you have any feedback."
    },
    'completed': { 
      title: 'Project Completed', 
      emoji: '🎉', 
      color: COLORS.success,
      message: "Congratulations! Your project has been completed successfully. We're excited to deliver the final results."
    },
    'on-hold': { 
      title: 'Project On Hold', 
      emoji: '⏸️', 
      color: COLORS.textMuted,
      message: "Your project is currently on hold. We'll resume work as soon as possible and keep you updated."
    },
  }
  
  const info = statusInfo[data.status] || statusInfo['in-progress']
  const progressBar = data.progress !== undefined
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 8px 0 0 0;">
        <tr>
          <td style="background-color: ${COLORS.border}; border-radius: 4px; height: 8px;" class="dark-border">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${data.progress}%" style="background-color: ${info.color}; border-radius: 4px; height: 8px;">
              <tr><td></td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="text-align: right; font-size: 12px; color: ${COLORS.textMuted}; padding-top: 4px;" class="dark-text-muted">${data.progress}% complete</td>
        </tr>
      </table>`
    : ''

  const content = `
    ${EmailHeader({ title: info.title, subtitle: data.projectName })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 24px; margin: 0 0 16px 0;">${info.emoji}</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            ${info.message}
          </p>
          ${EmailCardList({
            items: [
              { label: 'Project', value: data.projectName, highlight: true },
              { label: 'Status', value: `<span style="color: ${info.color}; font-weight: 600;">${data.status.replace('-', ' ').toUpperCase()}</span>` },
              ...(data.dueDate ? [{ label: 'Due Date', value: formatDate(data.dueDate, 'long') }] : []),
            ],
            variant: 'filled',
          })}
          ${progressBar}
          ${data.milestoneName ? EmailCard({
            children: `<p style="margin: 0 0 8px 0; font-weight: 600; color: ${COLORS.primary};">📌 Current Milestone: ${data.milestoneName}</p>${data.milestoneDescription ? `<p style="margin: 0; font-size: 14px; color: ${COLORS.textLight};">${data.milestoneDescription}</p>` : ''}`,
            variant: 'outlined',
          }) : ''}
          ${data.projectUrl ? EmailButton({ text: 'View Project', url: data.projectUrl, fullWidth: true }) : ''}
          <p style="font-size: 14px; line-height: 1.6; margin: 24px 0 0 0; color: ${COLORS.textMuted};" class="dark-text-muted">
            Have questions? Reply to this email or check your client portal for more details.
          </p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ 
    children: content,
    previewText: `${info.title} — ${data.projectName}`,
  })

  const text = `${info.title} — ${data.projectName}

Hi ${firstName},

${info.message}

Project: ${data.projectName}
Status: ${data.status.replace('-', ' ').toUpperCase()}
${data.dueDate ? `Due Date: ${formatDate(data.dueDate, 'long')}\n` : ''}${data.progress !== undefined ? `Progress: ${data.progress}%\n` : ''}${data.milestoneName ? `\nCurrent Milestone: ${data.milestoneName}
${data.milestoneDescription || ''}\n` : ''}${data.projectUrl ? `View Project: ${data.projectUrl}\n` : ''}Have questions? Reply to this email or check your client portal for more details.

— The Pink Beam Team`

  return {
    subject: `${info.title} — ${data.projectName}`,
    html,
    text,
  }
}

// ============================================================================
// File Sharing Templates
// ============================================================================

export function fileSharedNotificationTemplate(data: FileVariables): { subject: string; html: string; text: string } {
  const content = `
    ${EmailHeader({ title: 'File Shared', subtitle: data.fileName })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 24px; margin: 0 0 16px 0;">📎</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hello,</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            <strong style="color: ${COLORS.text};" class="dark-text">${data.uploadedBy}</strong> has shared a file with you${data.projectName ? ` for the <strong style="color: ${COLORS.text};" class="dark-text">${data.projectName}</strong> project` : ''}.
          </p>
          ${EmailCardList({
            items: [
              { label: 'File Name', value: data.fileName, highlight: true },
              { label: 'Size', value: data.fileSize },
              { label: 'Type', value: data.fileType },
              { label: 'Shared By', value: data.uploadedBy },
            ],
            variant: 'filled',
          })}
          ${EmailButton({ text: 'Download File', url: data.downloadUrl, fullWidth: true })}
          ${data.expiresAt ? `<p style="font-size: 13px; color: ${COLORS.warning}; margin: 16px 0 0 0; text-align: center;">⏰ This link expires on ${formatDate(data.expiresAt, 'short')}</p>` : ''}
          <p style="font-size: 14px; line-height: 1.6; margin: 24px 0 0 0; color: ${COLORS.textMuted};" class="dark-text-muted">
            If you have trouble downloading the file, reply to this email for assistance.
          </p>
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ 
    children: content,
    previewText: `${data.uploadedBy} shared ${data.fileName} with you`,
  })

  const text = `File Shared

Hello,

${data.uploadedBy} has shared a file with you${data.projectName ? ` for the ${data.projectName} project` : ''}.

File Name: ${data.fileName}
Size: ${data.fileSize}
Type: ${data.fileType}
Shared By: ${data.uploadedBy}

Download: ${data.downloadUrl}

${data.expiresAt ? `⏰ This link expires on ${formatDate(data.expiresAt, 'short')}\n` : ''}If you have trouble downloading the file, reply to this email for assistance.

— The Pink Beam Team`

  return {
    subject: `${data.uploadedBy} shared ${data.fileName} with you`,
    html,
    text,
  }
}

// ============================================================================
// Meeting Templates
// ============================================================================

export function meetingReminderTemplate(data: MeetingVariables): { subject: string; html: string; text: string } {
  const meetingTypeLabels: Record<string, { icon: string; locationLabel: string }> = {
    'zoom': { icon: '📹', locationLabel: 'Join URL' },
    'google-meet': { icon: '📹', locationLabel: 'Join URL' },
    'in-person': { icon: '📍', locationLabel: 'Location' },
    'phone': { icon: '📞', locationLabel: 'Call' },
  }
  
  const typeInfo = meetingTypeLabels[data.meetingType]
  
  const locationSection = data.meetingType === 'in-person' 
    ? `<p style="margin: 0; font-size: 14px; color: ${COLORS.textLight};" class="dark-text-secondary">${data.location}</p>`
    : data.joinUrl 
      ? EmailButton({ text: 'Join Meeting', url: data.joinUrl, fullWidth: true })
      : ''

  const content = `
    ${EmailHeader({ title: data.meetingTitle, subtitle: 'Meeting Reminder' })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 24px; margin: 0 0 16px 0;">${typeInfo.icon}</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.text};" class="dark-text">
            This is a reminder for your upcoming meeting.
          </p>
          ${EmailCardList({
            items: [
              { label: 'Date', value: data.meetingDate, highlight: true },
              { label: 'Time', value: data.meetingTime, highlight: true },
              { label: 'Duration', value: data.meetingDuration },
              { label: 'Type', value: data.meetingType.replace('-', ' ').toUpperCase() },
            ],
            variant: 'filled',
          })}
          ${data.agenda ? EmailCard({
            children: `<p style="margin: 0 0 8px 0; font-weight: 600; color: ${COLORS.primary};">Agenda</p><p style="margin: 0; font-size: 14px; color: ${COLORS.textLight};" class="dark-text-secondary">${data.agenda}</p>`,
            variant: 'outlined',
          }) : ''}
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 24px 0 0 0;">
            <tr>
              <td>
                <p style="margin: 0 0 8px 0; font-weight: 600; color: ${COLORS.text}; font-size: 14px;" class="dark-text">${typeInfo.locationLabel}</p>
                ${locationSection}
              </td>
            </tr>
          </table>
          ${data.attendees && data.attendees.length > 0 ? `<p style="font-size: 13px; color: ${COLORS.textMuted}; margin: 24px 0 0 0;" class="dark-text-muted">Attendees: ${data.attendees.map(a => a.name).join(', ')}</p>` : ''}
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ 
    children: content,
    previewText: `Reminder: ${data.meetingTitle} on ${data.meetingDate} at ${data.meetingTime}`,
  })

  const text = `Meeting Reminder: ${data.meetingTitle}

This is a reminder for your upcoming meeting.

Date: ${data.meetingDate}
Time: ${data.meetingTime}
Duration: ${data.meetingDuration}
Type: ${data.meetingType.replace('-', ' ').toUpperCase()}

${data.agenda ? `Agenda:\n${data.agenda}\n\n` : ''}${typeInfo.locationLabel}: ${data.location || data.joinUrl || 'TBD'}

${data.attendees && data.attendees.length > 0 ? `Attendees: ${data.attendees.map(a => a.name).join(', ')}` : ''}

— The Pink Beam Team`

  return {
    subject: `Reminder: ${data.meetingTitle} — ${data.meetingDate} at ${data.meetingTime}`,
    html,
    text,
  }
}

export function meetingInvitationTemplate(data: MeetingVariables & { senderName: string; acceptUrl?: string; declineUrl?: string }): { subject: string; html: string; text: string } {
  const meetingTypeLabels: Record<string, string> = {
    'zoom': '📹',
    'google-meet': '📹',
    'in-person': '📍',
    'phone': '📞',
  }

  const content = `
    ${EmailHeader({ title: 'Meeting Invitation', subtitle: data.meetingTitle })}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding: 28px;">
          <p style="font-size: 24px; margin: 0 0 16px 0;">${meetingTypeLabels[data.meetingType]}</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: ${COLORS.text};" class="dark-text">Hello,</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: ${COLORS.textLight};" class="dark-text-secondary">
            <strong style="color: ${COLORS.text};" class="dark-text">${data.senderName}</strong> has invited you to a meeting.
          </p>
          ${EmailCardList({
            items: [
              { label: 'Title', value: data.meetingTitle, highlight: true },
              { label: 'Date', value: data.meetingDate, highlight: true },
              { label: 'Time', value: data.meetingTime, highlight: true },
              { label: 'Duration', value: data.meetingDuration },
            ],
            variant: 'filled',
          })}
          ${data.agenda ? EmailCard({
            children: `<p style="margin: 0 0 8px 0; font-weight: 600; color: ${COLORS.primary};">Agenda</p><p style="margin: 0; font-size: 14px; color: ${COLORS.textLight};" class="dark-text-secondary">${data.agenda}</p>`,
            variant: 'outlined',
          }) : ''}
          ${data.acceptUrl && data.declineUrl ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 24px 0 0 0;"><tr><td style="text-align: center;">${EmailButton({ text: 'Accept', url: data.acceptUrl, variant: 'primary' })}${EmailButton({ text: 'Decline', url: data.declineUrl, variant: 'outline' })}</td></tr></table>` : ''}
        </td>
      </tr>
    </table>
    ${EmailFooterMinimal()}
  `

  const html = EmailLayout({ 
    children: content,
    previewText: `Meeting invitation from ${data.senderName}: ${data.meetingTitle}`,
  })

  const text = `Meeting Invitation

Hello,

${data.senderName} has invited you to a meeting.

Title: ${data.meetingTitle}
Date: ${data.meetingDate}
Time: ${data.meetingTime}
Duration: ${data.meetingDuration}

${data.agenda ? `Agenda:\n${data.agenda}\n` : ''}${data.acceptUrl ? `\nAccept: ${data.acceptUrl}\nDecline: ${data.declineUrl}` : ''}

— The Pink Beam Team`

  return {
    subject: `Meeting Invitation: ${data.meetingTitle}`,
    html,
    text,
  }
}

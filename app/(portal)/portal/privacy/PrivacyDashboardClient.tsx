'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { Download, Trash2, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PrivacyDashboardClientProps {
  user: User
}

export function PrivacyDashboardClient({ user }: PrivacyDashboardClientProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExportData = async () => {
    setIsExporting(true)
    setError(null)
    setExportSuccess(false)

    try {
      const response = await fetch('/api/user/data-export', {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to export data')
      }

      const data = await response.json()

      if (data.success) {
        setExportSuccess(true)
        // Download could be immediate or email-based depending on data size
        if (data.downloadUrl) {
          // Immediate download
          window.open(data.downloadUrl, '_blank')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setError('Please type DELETE to confirm account deletion')
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch('/api/user/delete', {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete account')
      }

      // Redirect to goodbye page or sign out
      window.location.href = '/sign-out?deleted=true'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account')
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Privacy & Data</h1>
          <p className="text-muted-foreground mt-2">
            Manage your privacy settings and exercise your data rights.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {exportSuccess && (
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Export Requested</AlertTitle>
            <AlertDescription>
              Your data export has been initiated. You'll receive an email with a download link when
              it's ready (usually within 5-10 minutes).
            </AlertDescription>
          </Alert>
        )}

        {/* Data Export Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Your Data
            </CardTitle>
            <CardDescription>
              Download all your personal data in JSON format. This includes your profile, subscriptions,
              conversation history, and billing information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Your export will include:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Account profile and settings</li>
                  <li>Subscription and billing history</li>
                  <li>AI employee conversation history</li>
                  <li>Project data (if applicable)</li>
                  <li>Usage and analytics data</li>
                </ul>
              </div>
              <Button
                onClick={handleExportData}
                disabled={isExporting}
                className="w-full sm:w-auto"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing Export...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export My Data
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                The export file will be available for 7 days. Large exports may be sent via email.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Deletion Card */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Account
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data. This action cannot be undone
              after 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning: This action is permanent</AlertTitle>
                <AlertDescription>
                  Deleting your account will:
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                    <li>Cancel all active subscriptions</li>
                    <li>Delete all AI conversation history</li>
                    <li>Remove all project data</li>
                    <li>Permanently delete your account after 30 days</li>
                  </ul>
                  <p className="mt-2 font-semibold">
                    You have 30 days to change your mind and recover your account.
                  </p>
                </AlertDescription>
              </Alert>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="w-full sm:w-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete My Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle>Your Privacy Rights</CardTitle>
            <CardDescription>
              Under GDPR and CCPA, you have the following rights:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold">Right to Access</h4>
                <p className="text-muted-foreground">
                  Request a copy of your personal data (use Export Data above)
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Right to Rectification</h4>
                <p className="text-muted-foreground">
                  Update your profile information in{' '}
                  <a href="/portal/settings" className="underline">
                    Account Settings
                  </a>
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Right to Erasure</h4>
                <p className="text-muted-foreground">
                  Request deletion of your personal data (use Delete Account above)
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Right to Object</h4>
                <p className="text-muted-foreground">
                  Contact{' '}
                  <a href="mailto:privacy@pinkbeam.io" className="underline">
                    privacy@pinkbeam.io
                  </a>{' '}
                  to object to data processing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirm Account Deletion
            </DialogTitle>
            <DialogDescription>
              This will permanently delete your account after 30 days. You can recover your account
              within that period by contacting support.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="delete-confirmation">
                Type <span className="font-mono font-bold">DELETE</span> to confirm:
              </Label>
              <Input
                id="delete-confirmation"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE"
                className="font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting || deleteConfirmation !== 'DELETE'}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

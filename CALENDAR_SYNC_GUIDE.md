# Calendar Synchronization Setup Guide

This guide explains how to sync your Margea property calendars with Airbnb, VRBO, and other booking platforms to prevent double-bookings.

## How It Works

The calendar sync uses **iCal (iCalendar)** format to share booking information between platforms:

- **Export**: Your Margea bookings are published as an iCal feed that Airbnb/VRBO can import
- **Import**: Airbnb/VRBO bookings are imported from their iCal feeds to block dates on your website
- **Auto-Sync**: Calendars automatically sync every hour (you can also sync manually)

## Setup Instructions

### Step 1: Export Margea Calendar to Airbnb

1. **Go to Calendar Sync Page**
   - Navigate to `/calendar-sync` on your website
   - Select the property you want to sync

2. **Copy Your iCal Export URL**
   - Click "Copy iCal URL" button
   - The URL format is: `https://your-site.com/functions/v1/ical-export?property_id=xxx`

3. **Add to Airbnb**
   - Go to your Airbnb listing calendar
   - Click on "Availability Settings" → "Sync calendars"
   - Click "Import calendar"
   - Paste the Margea iCal URL
   - Give it a name (e.g., "Margea Website")
   - Click "Import"

4. **Add to VRBO** (optional)
   - Go to your VRBO listing calendar
   - Click "Calendar Import/Export"
   - Click "Import a Calendar"
   - Paste the Margea iCal URL
   - Click "Subscribe"

### Step 2: Import Airbnb Calendar to Margea

1. **Get Airbnb's iCal Export URL**
   - Go to your Airbnb listing calendar
   - Click "Availability Settings" → "Sync calendars"
   - Find "Export calendar" section
   - Copy the calendar link (it looks like: `https://www.airbnb.com/calendar/ical/...`)

2. **Add to Margea**
   - Go to Calendar Sync page (`/calendar-sync`)
   - Select your property
   - Scroll to "Import from Airbnb/VRBO" section
   - Paste the Airbnb iCal URL
   - Click "Add"

3. **Repeat for VRBO** (if applicable)
   - Get VRBO's export URL from their calendar settings
   - Add it the same way in Margea

### Step 3: Verify and Sync

1. **Manual Sync**
   - Click "Sync Now" button on the Calendar Sync page
   - Wait for confirmation message
   - Check your booking calendar to see imported dates

2. **Automatic Sync**
   - Calendars will sync automatically every hour
   - No action needed on your part

## Important Notes

### What Gets Synced

**From Margea to Airbnb/VRBO:**
- All confirmed and pending bookings
- Check-in and check-out dates
- Guest names (displayed as "Reserved - [Name]")

**From Airbnb/VRBO to Margea:**
- All blocked dates and bookings
- Displayed in the booking calendar as unavailable
- Prevents double-bookings on your website

### Sync Timing

- **Airbnb**: Updates imported calendars every 4-24 hours
- **VRBO**: Updates imported calendars every 2-4 hours
- **Margea**: Syncs every hour automatically, or instantly when you click "Sync Now"

### Troubleshooting

**Problem: Dates aren't syncing**
- Wait 24 hours for first sync (Airbnb can be slow)
- Click "Sync Now" to force a manual sync
- Verify the iCal URLs are correct
- Check that properties are properly linked

**Problem: Double-bookings still occurring**
- Ensure you've completed BOTH steps (export AND import)
- Verify calendars show blocked dates on both platforms
- Sync frequency may cause a delay - manually sync before accepting bookings

**Problem: Old bookings showing**
- External bookings are automatically cleaned up during sync
- Old dates (past today) are not imported
- Click "Sync Now" to refresh

## Technical Details

### iCal Feed Structure

Your iCal export includes:
- Property name and location
- All bookings with dates
- Booking references and status
- Timezone: America/Cancun

### Database Tables

- `properties.external_ical_urls`: Stores imported calendar URLs
- `external_bookings`: Stores bookings imported from external calendars
- `bookings`: Your website's native bookings

### API Endpoints

- **Export**: `/functions/v1/ical-export?property_id=xxx`
  - Public endpoint (no authentication required)
  - Returns standard .ics format
  
- **Sync**: `/functions/v1/ical-sync`
  - Imports all external calendars
  - Runs automatically via cron job every hour

## Best Practices

1. **Always sync both ways** - Export to Airbnb AND import from Airbnb
2. **Monitor sync status** - Check regularly that calendars are updating
3. **Manual sync before busy periods** - Click "Sync Now" before high-booking seasons
4. **Keep URLs private** - Don't share your iCal export URLs publicly
5. **One URL per platform** - Add separate calendar URLs for each platform

## Support

For issues with:
- **Airbnb calendar sync**: https://www.airbnb.com/help/article/99
- **VRBO calendar sync**: https://help.vrbo.com/articles/How-do-I-sync-my-calendar-with-other-websites
- **Margea sync issues**: Contact admin@margeatravel.com

## Advanced: Setting Up Automatic Hourly Sync

The sync can be automated using Supabase cron jobs. To enable this, you need to run the following SQL (already configured):

```sql
select cron.schedule(
  'ical-sync-hourly',
  '0 * * * *', -- Every hour
  $$
  select net.http_post(
      url:='https://YOUR-PROJECT.supabase.co/functions/v1/ical-sync',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
      body:='{}'::jsonb
  ) as request_id;
  $$
);
```

This ensures calendars stay synchronized without manual intervention.

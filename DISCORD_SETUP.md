# Discord Integration Setup Guide

## Overview
This guide shows how to set up Discord notifications for form submissions and event updates.

## 1. Create Discord Webhook

### Step 1: Create a Discord Webhook
1. Go to your Discord server
2. Right-click on the channel where you want notifications
3. Select "Edit Channel"
4. Go to "Integrations" → "Webhooks"
5. Click "New Webhook"
6. Give it a name like "ACM Forms Bot"
7. Copy the Webhook URL

### Step 2: Set Up Formspree Discord Integration
1. Go to your Formspree dashboard
2. For each form, go to "Settings" → "Integrations"
3. Add Discord integration with your webhook URL
4. Configure the message format

Example Discord message format for Formspree:
```
🔔 **New {{form_type}} Submission**
**Name:** {{name}}
**Email:** {{email}}
**Message/Details:** {{message}}
```

## 2. GitHub Actions Discord Integration

### Add Discord Webhook to GitHub Secrets
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add new repository secret:
   - Name: `DISCORD_WEBHOOK_URL`
   - Value: Your Discord webhook URL

### The GitHub Action will automatically:
- Fetch Dragon Central RSS every 6 hours
- Convert to JSON format (solves CORS issues)
- Post updates to Discord when events change
- Commit updated events.json to repository

## 3. Form Submission Limits & Strategy

### Formspree Free Tier (5 submissions/month):
- **Contact Form:** 2 submissions allocated
- **3D Print Requests:** 2 submissions allocated  
- **Laptop Borrowing:** 1 submission allocated

### When limits are reached:
- Forms still work but require Formspree upgrade ($10/month)
- Discord notifications continue working
- All data is still collected

### Alternative: GitHub Issues Integration
If you prefer unlimited free submissions:
1. Set up GitHub Issues templates
2. Use GitHub's API to create issues from forms
3. Discord bot monitors GitHub Issues
4. More complex setup but completely free

## 4. Discord Bot Features (Optional Advanced Setup)

### Create a custom Discord bot that can:
- Monitor GitHub Issues for form submissions
- Post formatted messages with better styling
- React to messages with emojis
- Create threads for each form submission
- Send direct messages to board members

### Bot Commands Ideas:
- `!events` - Show upcoming events
- `!forms` - Show form submission count/limits
- `!website` - Show website statistics

## 5. Event Integration Workflow

```
Dragon Central RSS → GitHub Action → events.json → Website Display
                                  ↓
                            Discord Notification
```

### Benefits:
- ✅ No CORS issues (server-side processing)
- ✅ Automatic updates every 6 hours
- ✅ Discord notifications for event changes
- ✅ Reliable and maintainable
- ✅ Version controlled event history

## 6. Setup Checklist

### For Static GitHub Pages:
- [ ] Replace Formspree Form IDs in index.html
- [ ] Set up Discord webhook
- [ ] Configure Formspree → Discord integration
- [ ] Add GitHub secret for Discord webhook
- [ ] Update Discord invite link in HTML
- [ ] Test all form submissions
- [ ] Verify GitHub Action runs successfully

### Form IDs to Replace:
In `index.html`, replace these placeholder IDs:
- `YOUR_FORM_ID` → Your main contact form ID
- `YOUR_PRINT_FORM_ID` → Your 3D print form ID  
- `YOUR_LAPTOP_FORM_ID` → Your laptop borrowing form ID

### Discord Links to Update:
- Update `https://discord.gg/your-invite` with your actual Discord invite
- Update email address from `acm@mnstate.edu` to your actual ACM email

## 7. Testing

### Test Form Submissions:
1. Submit test data through each form
2. Verify Discord notifications appear
3. Check Formspree dashboard for submissions
4. Ensure forms reset after successful submission

### Test Event Updates:
1. Manually trigger GitHub Action (Actions tab → Update Dragon Central Events → Run workflow)
2. Check if events.json is updated
3. Verify Discord notification is sent
4. Confirm website displays events correctly

## 8. Monitoring & Maintenance

### Regular Checks:
- Monitor Formspree submission limits
- Verify GitHub Actions are running successfully
- Check Discord notifications are working
- Update RSS parsing if Dragon Central changes format

### When to Upgrade Formspree:
- Approaching 5 submissions/month limit
- Need more advanced features (file uploads, etc.)
- Want spam protection and advanced analytics